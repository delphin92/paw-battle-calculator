import {
    ArtilleryTactic,
    Battle,
    BattleParty,
    BattlePartyUnitsDamage,
    BattlePartyUnitsCharacteristic,
    BattleSummary,
    BattlingUnit,
    Tactic,
    UnitDamage
} from "model/battle";
import {Armies, BattleCharacteristic, getByPath, Party, Unit, UnitLeaf, unitPathsEq, UnitType} from "model/army";
import {flatten, sumBy} from "lodash";

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

export const calculateBattlePartyUnitsCharacteristic = (battleParty: BattleParty, armies: Armies): BattlePartyUnitsCharacteristic => {
    const getForType = (type: UnitType) => battleParty[type].units
            .map(unit => calculateUnitCharacteristic(getByPath(armies, unit.path) as UnitLeaf, battleParty[type].tactic));

    return {
        [UnitType.infantry]: getForType(UnitType.infantry),
        [UnitType.cavalry]: getForType(UnitType.cavalry),
        [UnitType.artillery]: getForType(UnitType.artillery)
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
        infantryPursuit,
        cavalryPursuit,
        totalPower,
        totalPursuit
    };
}

export const calculateResultRate = (battle: Battle, party: Party): number => {
    const battleParty = battle[party];
    const enemyParty = battle[party === 'rovania' ? 'brander' : 'rovania'];

    return battleParty.battleSummary.totalPower / enemyParty.battleSummary.totalPower;
}

export const calculatePartyDamage = (battle: Battle, party: Party): BattlePartyUnitsDamage => {
    const battleParty = battle[party];
    const enemyParty = battle[party === 'rovania' ? 'brander' : 'rovania'];

    const resultRate = calculateResultRate(battle, party);
    const successRate = resultRate > 1 ? resultRate : 1 / resultRate;
    let manpowerDamage: number;
    let moraleDamage: number;

        // tiring
    moraleDamage = 100 / resultRate;

    if (resultRate > 0.9) {
        // success or draw
        manpowerDamage = enemyParty.battleSummary.totalPower / successRate;

        if (resultRate > 1.1) {
            // success, inspiration
            moraleDamage -= (resultRate - 1) * 100;
        }
    } else {
        manpowerDamage = enemyParty.battleSummary.totalPower / successRate +
            enemyParty.battleSummary.totalPursuit * successRate;
            // panic
        moraleDamage += enemyParty.battleSummary.totalPursuit / resultRate;
    }

        // fear
    moraleDamage += manpowerDamage;

    const sumDamDistrCoeffForType = (type: UnitType) =>
        sumBy(battleParty[type].units, battlingUnit => battlingUnit.damageDistributionCoefficient);

    const damDistrCoeffSum =
        sumDamDistrCoeffForType(UnitType.infantry) +
        sumDamDistrCoeffForType(UnitType.cavalry) +
        sumDamDistrCoeffForType(UnitType.artillery);

    console.log(`${party} manpower damage ${manpowerDamage}`);
    console.log(`${party} morale damage ${moraleDamage}`);

    const calculateDamageForType = (type: UnitType) =>
        battleParty[type].units.map(unit => {
            const damageProportion = unit.damageDistributionCoefficient / damDistrCoeffSum;

            return {
                unit: unit.path,
                manpowerDamage: manpowerDamage * damageProportion / unit.battleCharacteristic.security,
                moraleDamage: moraleDamage * damageProportion / unit.battleCharacteristic.calm,
                disorder: unit.battleCharacteristic.disordering / successRate
            };
        })

    return {
        [UnitType.infantry]: calculateDamageForType(UnitType.infantry),
        [UnitType.cavalry]: calculateDamageForType(UnitType.cavalry),
        [UnitType.artillery]: calculateDamageForType(UnitType.artillery)
    };
}

const decreasePrecision = (num: number): number => {
    const exponent = Math.pow(10, Math.max(Math.floor(num).toString().length - 2, 0));
    return Math.round(num / exponent) * exponent
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

    const damage =
        flatten([UnitType.infantry, UnitType.cavalry, UnitType.artillery].map(unitType =>
            battleParty[unitType].units.map(unit => {
                const damage = decreasePrecision(unit.takenDamage.manpowerDamage);
                return damage > 10 &&
                    `${getByPath(armies, unit.path).name} потерял приблизительно ${damage} человек`;
            })
        )).filter(item => item).join(', ')

    const ifPresented = (unitType: UnitType) => (text: string): string =>
        battleParty[unitType].units.length
            ? text
            : '';

    text += `Генерал ${commanderName}!\n`+
            `Вверенные мне подразделения ведут бой ${battle.place}\n` +
            `В бою участвуют: ${unitNames}\n` +
            ifPresented(UnitType.infantry)(`Пехота производит ${battleParty[UnitType.infantry].tactic},\n`) +
            ifPresented(UnitType.cavalry)(`Кавалерия производит ${battleParty[UnitType.cavalry].tactic},\n`) +
            ifPresented(UnitType.artillery)(`Артиллерия производит ${battleParty[UnitType.artillery].tactic}.\n`) +
            `Нам противостоит примерно ${decreasePrecision(enemyManpower)} человек.\n` +
            damage +
    '';
    return text;
}