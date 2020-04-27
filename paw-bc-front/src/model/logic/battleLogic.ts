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

    const battlingUnitsCount = battleParty[UnitType.infantry].units.length +
        battleParty[UnitType.cavalry].units.length +
        battleParty[UnitType.artillery].units.length;

    return {
        [UnitType.infantry]: battleParty[UnitType.infantry].units.map(unit => ({
            unit: unit.path,
            manpowerDamage: enemyParty.battleSummary.totalPower / battlingUnitsCount,
            moraleDamage: enemyParty.battleSummary.totalPower / battlingUnitsCount
        })),
        [UnitType.cavalry]: battleParty[UnitType.cavalry].units.map(unit => ({
            unit: unit.path,
            manpowerDamage: enemyParty.battleSummary.totalPower / battlingUnitsCount,
            moraleDamage: enemyParty.battleSummary.totalPower / battlingUnitsCount
        })),
        [UnitType.artillery]: battleParty[UnitType.artillery].units.map(unit => ({
            unit: unit.path,
            manpowerDamage: enemyParty.battleSummary.totalPower / battlingUnitsCount,
            moraleDamage: enemyParty.battleSummary.totalPower / battlingUnitsCount
        })),
    };
}