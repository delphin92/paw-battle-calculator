import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ArtilleryTactic, Battle, BattlingUnit, CavalryTactic, InfantryTactic, Tactic} from "model/battle";
import {filterUnitsByType, getAllSubunits, Unit, UnitLeaf, unitPathsEq, UnitType} from "model/army";
import { remove } from "lodash";

export interface BattlesState {
    battles: Battle[];
    nextBattleId: number;
}

const newBattle = (id: number): Battle => ({
    id,
    place: 'Битва ' + id,
    rovania: {
        allBattlingUnits: [],
        [UnitType.infantry]: {
            tactic: InfantryTactic.skirmish,
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
    },
    brander: {
        allBattlingUnits: [],
        [UnitType.infantry]: {
            tactic: InfantryTactic.skirmish,
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
    }
})

const battles = createSlice({
    name: 'battles',
    initialState: {
        battles: [newBattle(0)],
        nextBattleId: 1
    } as BattlesState,
    reducers: {
        addBattle: state => {
            state.battles.push(newBattle(state.nextBattleId));

            state.nextBattleId += 1;
        },

        addUnitToBattle: (state, {payload: {battleIndex, unit}}: PayloadAction<{battleIndex: number, unit: Unit}>) => {
            const battle = state.battles[battleIndex];

            if (battle) {
                const party = unit.path[0] === 0 ? battle.rovania : battle.brander;

                const allAddedUnits = getAllSubunits(unit);
                party.allBattlingUnits.push(...allAddedUnits.map(unit => unit.path));

                const addUnitsOfType = (type: UnitType) =>
                    party[type].units.push(...filterUnitsByType(allAddedUnits, type).map(unit => ({
                        path: unit.path,
                        power: unit.power?.[party[unit.type].tactic] ?? 0
                    })));

                addUnitsOfType(UnitType.infantry);
                addUnitsOfType(UnitType.cavalry);
                addUnitsOfType(UnitType.artillery);
            }
        },

        removeUnitFromBattle: (state, {payload: {battleIndex, unit}}: PayloadAction<{battleIndex: number, unit: Unit}>) => {
            const battle = state.battles[battleIndex];

            if (battle) {
                const party = unit.path[0] === 0 ? battle.rovania : battle.brander;
                const units = party.allBattlingUnits;
                const allDeletedUnits = getAllSubunits(unit);

                allDeletedUnits.forEach(unit => {
                    remove(units, path => unitPathsEq(path, unit.path));

                    if ('type' in unit) {
                        remove(party[unit.type].units, u => unitPathsEq(u.path, unit.path));
                    }
                })
            }
        },

        setBattleTactic: (state, {payload: {battleIndex, party, tactic, unitType}}: PayloadAction<{battleIndex: number, party: 'rovania' | 'brander', tactic: Tactic, unitType: UnitType}>) => {
            state.battles[battleIndex][party][unitType].tactic = tactic;
        },

        changeUnitPower: (state, {payload: {battleIndex, unit, power}}: PayloadAction<{battleIndex: number, unit: UnitLeaf, power: number}>) => {
            const battle = state.battles[battleIndex];

            if (battle) {
                const party = unit.path[0] === 0 ? battle.rovania : battle.brander;

                const stUnit = party[unit.type].units.find(battlingUnit => unitPathsEq(battlingUnit.path, unit.path)) as BattlingUnit;

                stUnit.power = power;
            }
        }

        // _updateForces
    }
});

/****** EXPORT ******/

export const {addUnitToBattle, removeUnitFromBattle, addBattle, setBattleTactic, changeUnitPower} = battles.actions;

// export const calculate = (battleIndex: number, party: Party): ThunkAction<void, RootState, unknown, Action<unknown>> => (dispatch, getState) => {
//     const armies = getState().armiesState.armies;
//     const battle = getState().battles.battles[battleIndex];
//     const battleParty = battle[party];
//
//     const getSubunits = (unit: Unit): Unit | Unit[] => unit.subunits
//         ? unit.subunits.flatMap(getSubunits)
//         : unit;
//
//     const regiments = battleParty.units.flatMap(
//         flow(
//             unitPath => getByPath(armies, unitPath),
//             getSubunits
//         )
//     )
//
//     let mainForces: Unit[] = [];
//     let mainForcesPower = 0;
//     // let support: Unit[] = [];
//
//     if ([InfantryTactic.skirmish, InfantryTactic.firefight, InfantryTactic.columnAttack, InfantryTactic.square]
//             .includes(battleParty.tactic)) {
//         mainForces = filterUnitsByType(regiments, UnitType.infantry);
//         mainForcesPower = mainForces.reduce((sum, unit) => sum + (unit.power?.[battleParty.tactic] || 0), 0);
//
//
//         // support = filterUnitsByType(regiments, UnitType.artillery);
//     }
//
//     // const mainForces = ({
//     //     [BattleTactic.skirmish]: () => filterUnitsByType(regiments, UnitType.infantry),
//     //     [BattleTactic.firefight]: () => filterUnitsByType(regiments, UnitType.infantry),
//     //     [BattleTactic.columnAttack]: () => filterUnitsByType(regiments, UnitType.infantry),
//     //     [BattleTactic.square]: () => filterUnitsByType(regiments, UnitType.infantry),
//     // })[battleParty.tactic]()
// }

export default battles.reducer;