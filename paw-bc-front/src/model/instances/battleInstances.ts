import {ArtilleryTactic, Battle, BattleParty, CavalryTactic, InfantryTactic} from "model/battle";
import {UnitType} from "model/army";

export const emptyBattleParty: BattleParty = {
    allBattlingUnits: [],
    battleSummary: {
        infantryPower: 0,
        cavalryPower: 0,
        artilleryPower: 0,
        infantryPursuit: 0,
        cavalryPursuit: 0,
        totalPower: 0,
        totalPursuit: 0
    },
    report: '',
    [UnitType.infantry]: {
        tactic: InfantryTactic.probe,
        units: [],
        totalPower: 0
    },
    [UnitType.cavalry]: {
        tactic: CavalryTactic.support,
        units: [],
        totalPower: 0
    },
    [UnitType.artillery]: {
        tactic: ArtilleryTactic.support,
        units: [],
        totalPower: 0
    }
};

export const newBattle = (id: number): Battle => ({
    id,
    place: 'Битва ' + id,
    battleConditions: {
        rovania: {
            defenceBonus: 0,
            cavalryPenalty: 0,
            formationPenalty: 0,
            artilleryFactor: 0
        },
        brander: {
            defenceBonus: 0,
            cavalryPenalty: 0,
            formationPenalty: 0,
            artilleryFactor: 0
        }
    },
    rovania: emptyBattleParty,
    brander: emptyBattleParty
})