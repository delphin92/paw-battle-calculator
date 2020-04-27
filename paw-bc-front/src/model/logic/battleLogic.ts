import {
    ArtilleryTactic,
    Battle,
    BattleParty,
    BattlePartyUnitsDamage,
    BattlePartyUnitsPower,
    BattleSummary,
    BattlingUnit,
    InfantryTactic,
    Tactic,
    UnitDamage
} from "model/battle";
import {Armies, getByPath, Party, Unit, UnitLeaf, unitPathsEq, UnitType} from "model/army";
import {sumBy} from "lodash";

export const isUnitInBattle = (battle: Battle, unit: Unit) => {
    const party = unit.path[0] === 0 ? battle.rovania.allBattlingUnits : battle.brander.allBattlingUnits;
    const unitIndex = party.findIndex(path => unitPathsEq(path, unit.path));
    return unitIndex >= 0;
}

export const getDamage = ({path, takenDamage: {moraleDamage, manpowerDamage}}: BattlingUnit): UnitDamage => ({
    unit: path,
    manpowerDamage,
    moraleDamage
})

export const calculateUnitPower = (unit: UnitLeaf, tactic: Tactic): number => {
    let numberFactor;

    if (tactic === InfantryTactic.square) {
        numberFactor = unit.morale;
    } else if (tactic === InfantryTactic.columnAttack) {
        numberFactor = (unit.manpower + unit.morale) / 2;
    } else {
        numberFactor = unit.manpower;
    }

    return (unit.power[tactic] ?? 0) / 100 * numberFactor;
}

export const calculateBattlePartyUnitsPower = (battleParty: BattleParty, armies: Armies): BattlePartyUnitsPower => {
    const getForType = (type: UnitType) => battleParty[type].units
            .map(unit => calculateUnitPower(getByPath(armies, unit.path) as UnitLeaf, battleParty[type].tactic));

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

    const infantryPower = sumBy(battleParty[UnitType.infantry].units, unit => unit.power);
    const cavalryPower = sumBy(battleParty[UnitType.cavalry].units, unit => unit.power);
    const artilleryPower = sumBy(battleParty[UnitType.artillery].units, unit => unit.power);

    totalPower += infantryPower;

    // if (battleParty[UnitType.cavalry].tactic === CavalryTactic.support) {
    //     if (battleParty[UnitType.infantry].tactic === InfantryTactic.firefight ||
    //         battleParty[UnitType.infantry].tactic === InfantryTactic.columnAttack) {

    const enemyCavalryPower = sumBy(enemyParty[UnitType.cavalry].units, unit => unit.power);
    const cavalrySupportBonus = (cavalryPower - enemyCavalryPower) *
        (1 - 0.1 * battle.battleConditions.cavalryPenalty);
    totalPower += cavalrySupportBonus
    //     }
    // }

    let artillerySupportBonus = 0;

    if (battleParty[UnitType.artillery].tactic === ArtilleryTactic.support) {
        if (enemyParty[UnitType.artillery].tactic === ArtilleryTactic.artillerySuppression) {
            const enemyArtilleryPower = sumBy(enemyParty[UnitType.artillery].units, unit => unit.power);
            artillerySupportBonus = artilleryPower - enemyArtilleryPower;
        } else {
            artillerySupportBonus = artilleryPower;
        }

        totalPower += artillerySupportBonus;
    }

    totalPower = Math.max(totalPower, 0);

    return {
        infantryPower,
        cavalryPower,
        artilleryPower,
        cavalrySupportBonus,
        artillerySupportBonus,
        totalPower
    };
}

export const calculatePartyDamage = (battle: Battle, party: Party): BattlePartyUnitsDamage => {
    const battleParty = battle[party];
    const enemyParty = battle[party === 'rovania' ? 'brander' : 'rovania'];

    const sumDamDistrCoeffForType = (type: UnitType) =>
        sumBy(battleParty[type].units, battlingUnit => battlingUnit.damageDistributionCoefficient);

    const damDistrCoeffSum =
        sumDamDistrCoeffForType(UnitType.infantry) +
        sumDamDistrCoeffForType(UnitType.cavalry) +
        sumDamDistrCoeffForType(UnitType.artillery);

    const calculateDamageForType = (type: UnitType) =>
        battleParty[type].units.map(unit => ({
            unit: unit.path,
            manpowerDamage: enemyParty.battleSummary.totalPower / damDistrCoeffSum * unit.damageDistributionCoefficient,
            moraleDamage: enemyParty.battleSummary.totalPower / damDistrCoeffSum * unit.damageDistributionCoefficient
        }))

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