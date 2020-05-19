import {
    ArtilleryTactic,
    Battle,
    BattleParty,
    BattlePartyUnitsDamage,
    BattlePartyUnitsPower,
    BattleSummary,
    BattlingUnit,
    Tactic,
    UnitDamage
} from "model/battle";
import {Armies, BattleCharacteristic, getByPath, Party, Unit, UnitLeaf, unitPathsEq, UnitType} from "model/army";
import {sumBy} from "lodash";

export const isUnitInBattle = (battle: Battle, unit: Unit) => {
    const party = unit.path[0] === 0 ? battle.rovania.allBattlingUnits : battle.brander.allBattlingUnits;
    const unitIndex = party.findIndex(path => unitPathsEq(path, unit.path));
    return unitIndex >= 0;
}

export const getDamage = ({path, takenDamage: {moraleDamage, manpowerDamage, disorder}}: BattlingUnit): UnitDamage => ({
    unit: path,
    manpowerDamage,
    moraleDamage,
    disorder
})

export const calculateUnitCharacteristic = (unit: UnitLeaf, tactic: Tactic): BattleCharacteristic => {
    let numberFactor;

    // if (tactic === InfantryTactic.square) {
    //     numberFactor = unit.morale;
    // } else if (tactic === InfantryTactic.columnAttack) {
    //     numberFactor = (unit.manpower + unit.morale) / 2;
    // } else {
    //     numberFactor = unit.manpower;
    // }

    numberFactor = Math.sqrt(unit.manpower * unit.morale);

    const battleCharacteristic = unit.battleCharacteristics?.[tactic] || {} as BattleCharacteristic;

    return {
        ...battleCharacteristic,
        power: (battleCharacteristic.power ?? 0) / 100 * numberFactor,
        pursuit: (battleCharacteristic.pursuit ?? 0) / 100 * numberFactor
    };
}

export const calculateBattlePartyUnitsPower = (battleParty: BattleParty, armies: Armies): BattlePartyUnitsPower => {
    const getForType = (type: UnitType) => battleParty[type].units
            .map(unit => calculateUnitCharacteristic(getByPath(armies, unit.path) as UnitLeaf, battleParty[type].tactic).power);

    return {
        [UnitType.infantry]: getForType(UnitType.infantry),
        [UnitType.cavalry]: getForType(UnitType.cavalry),
        [UnitType.artillery]: getForType(UnitType.infantry),
    }
}

export const calculateBattleSummary = (battle: Battle, party: Party): BattleSummary => {
    const battleParty = battle[party];
    const enemyParty = battle[party === 'rovania' ? 'brander' : 'rovania'];

    let totalPower = 0;

    const infantryPower = sumBy(battleParty[UnitType.infantry].units, unit => unit.battleCharacteristic.power);
    const cavalryPower = sumBy(battleParty[UnitType.cavalry].units, unit => unit.battleCharacteristic.power);
    const artilleryPower = sumBy(battleParty[UnitType.artillery].units, unit => unit.battleCharacteristic.power);

    totalPower += infantryPower + cavalryPower;

    let artillerySupportBonus = 0;

    if (battleParty[UnitType.artillery].tactic === ArtilleryTactic.support) {
        if (enemyParty[UnitType.artillery].tactic === ArtilleryTactic.artillerySuppression) {
            const enemyArtilleryPower = sumBy(enemyParty[UnitType.artillery].units, unit => unit.battleCharacteristic.power);
            artillerySupportBonus = artilleryPower - enemyArtilleryPower;
        } else {
            artillerySupportBonus = artilleryPower;
        }

        totalPower += artillerySupportBonus;
    }

    totalPower = Math.max(totalPower, 0);

    const infantryPursuit = sumBy(battleParty[UnitType.infantry].units, unit => unit.battleCharacteristic.pursuit);
    const cavalryPursuit = sumBy(battleParty[UnitType.cavalry].units, unit => unit.battleCharacteristic.pursuit);
    const totalPursuit = infantryPursuit + cavalryPursuit;

    return {
        infantryPower,
        cavalryPower,
        artilleryPower,
        totalPower,
        totalPursuit
    };
}

export const calculatePartyDamage = (battle: Battle, party: Party): BattlePartyUnitsDamage => {
    const battleParty = battle[party];
    const enemyParty = battle[party === 'rovania' ? 'brander' : 'rovania'];

    const resultRate = battleParty.battleSummary.totalPower / enemyParty.battleSummary.totalPower;
    const successRate = resultRate > 1 ? resultRate : 1 / resultRate;
    let damage: number;

    if (resultRate > 1.2) {
        // success
        damage = enemyParty.battleSummary.totalPower / successRate;
    } else {
        damage = enemyParty.battleSummary.totalPower / successRate +
            enemyParty.battleSummary.totalPursuit * successRate;
    }

    const sumDamDistrCoeffForType = (type: UnitType) =>
        sumBy(battleParty[type].units, battlingUnit => battlingUnit.damageDistributionCoefficient);

    const damDistrCoeffSum =
        sumDamDistrCoeffForType(UnitType.infantry) +
        sumDamDistrCoeffForType(UnitType.cavalry) +
        sumDamDistrCoeffForType(UnitType.artillery);

    const calculateDamageForType = (type: UnitType) =>
        battleParty[type].units.map(unit => {
            const damageProportion = unit.damageDistributionCoefficient / damDistrCoeffSum;

            return {
                unit: unit.path,
                manpowerDamage: damage * damageProportion / unit.battleCharacteristic.security,
                moraleDamage: damage * damageProportion / unit.battleCharacteristic.calm,
                disorder: unit.battleCharacteristic.disordering / successRate
            };
        })

    return {
        [UnitType.infantry]: calculateDamageForType(UnitType.infantry),
        [UnitType.cavalry]: calculateDamageForType(UnitType.cavalry),
        [UnitType.artillery]: calculateDamageForType(UnitType.artillery)
    };
}

export const generateReport = (battle: Battle, party: Party, armies: Armies): string => {
    const battleParty = battle[party];
    const enemy = battle[party === 'rovania' ? 'brander' : 'rovania'];

    let text = '';

    const commanderName = armies[party].commanderName;
    const unitNames = battleParty.allBattlingUnits
        .map(unit => getByPath(armies, unit))
        .filter(unit => 'type' in unit)
        .map(unit => unit.name).join(', ');

    const enemyManpower = sumBy(
        enemy.allBattlingUnits.map(unit => getByPath(armies, unit)).filter(unit => 'manpower' in unit) as UnitLeaf[],
        unit => unit.manpower
    );

    // const damage = battleParty.allBattlingUnits
    //     .map(unit => getByPath(armies, unit)).map(unit).join(', ');

    text += `Генерал ${commanderName}!\n`+
            `Вверенные мне подразделения ведут бой ${battle.place}\n` +
            `В бою участвуют: ${unitNames}\n` +
            `Пехота производит ${battleParty[UnitType.infantry].tactic},\n` +
            `Кавалерия производит ${battleParty[UnitType.cavalry].tactic},\n` +
            `Артиллерия производит ${battleParty[UnitType.artillery].tactic}.\n` +
            `Нам противостоит примерно ${enemyManpower} человек` +
    '';
    return text;
}