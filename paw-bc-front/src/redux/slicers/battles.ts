import {Action, createSlice, PayloadAction, ThunkAction} from "@reduxjs/toolkit";
import {
    ArtilleryTactic,
    Battle,
    BattleConditions,
    BattlingUnit,
    CavalryTactic,
    InfantryTactic,
    Tactic
} from "model/battle";
import {filterUnitsByType, getAllSubunits, getByPath, Party, Unit, UnitLeaf, unitPathsEq, UnitType} from "model/army";
import {remove} from "lodash";
import {RootState} from "redux/rootReducer";

export interface BattlesState {
    battles: Battle[];
    nextBattleId: number;
}

const newBattle = (id: number): Battle => ({
    id,
    place: 'Битва ' + id,
    battleConditions: {
        defenceBonus: 0,
        cavalryPenalty: 0,
        formationPenalty: 0,
        artilleryFactor: 0
    },
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

interface SetBattleTacticActionPayload {
    battleIndex: number,
    party: Party,
    tactic: Tactic,
    unitType: UnitType
}

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

        _setBattleTactic: (state, {payload: {battleIndex, party, tactic, unitType}}: PayloadAction<{battleIndex: number, party: 'rovania' | 'brander', tactic: Tactic, unitType: UnitType}>) => {
            state.battles[battleIndex][party][unitType].tactic = tactic;
        },

        changeUnitPower: (state, {payload: {battleIndex, unit, power}}: PayloadAction<{battleIndex: number, unit: UnitLeaf, power: number}>) => {
            const battle = state.battles[battleIndex];

            if (battle) {
                const party = unit.path[0] === 0 ? battle.rovania : battle.brander;

                const stUnit = party[unit.type].units.find(battlingUnit => unitPathsEq(battlingUnit.path, unit.path)) as BattlingUnit;

                stUnit.power = power;
            }
        },
        _updateUnitsPower: (state, {payload: {battleIndex, party, unitType, powers}}: PayloadAction<{battleIndex: number, party: Party, unitType: UnitType, powers: number[]}>) => {

            state.battles[battleIndex][party][unitType].units.forEach((battlingUnit, i) => {
                battlingUnit.power = powers[i]
            })
        },
        _changeBattleConditions: (state, {payload: {battleIndex, field, value}}: PayloadAction<{battleIndex: number, field: keyof BattleConditions, value: number}>) => {
            state.battles[battleIndex].battleConditions[field] = value;
        }
    }
});

const {_setBattleTactic, _updateUnitsPower, _changeBattleConditions} = battles.actions;

/****** EXPORT ******/

export const {addUnitToBattle, removeUnitFromBattle, addBattle, changeUnitPower} = battles.actions;

export const setBattleTactic = ({battleIndex, party, tactic, unitType}: SetBattleTacticActionPayload): ThunkAction<void, RootState, unknown, Action<unknown>> =>
    (dispatch, getState) => {
        dispatch(_setBattleTactic({battleIndex, party, tactic, unitType}));

        const state = getState();
        const armies = state.armiesState.armies;
        const battleParty = state.battles.battles[battleIndex][party];

        const powers = battleParty[unitType].units
            .map(battlingUnit => getByPath(armies, battlingUnit.path) as UnitLeaf)
            .map(unit => unit.power[tactic] ?? 0)

        dispatch(_updateUnitsPower({battleIndex, party, unitType, powers}));
}

export const changeBattleConditions = (battleIndex: number, field: keyof BattleConditions, value: number): ThunkAction<void, RootState, unknown, Action<unknown>> => dispatch => {
    dispatch(_changeBattleConditions({battleIndex, field, value}));
}

export default battles.reducer;