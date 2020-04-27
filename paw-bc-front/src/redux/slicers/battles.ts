import {Action, createSlice, PayloadAction, ThunkAction} from "@reduxjs/toolkit";
import {
    Battle,
    BattleConditions,
    BattlePartyUnitsDamage, BattlePartyUnitsPower,
    BattleSummary,
    BattlingUnit,
    Tactic
} from "model/battle";
import {filterUnitsByType, getAllSubunits, Party, Unit, UnitLeaf, unitPathsEq, UnitType} from "model/army";
import {remove} from "lodash";
import {RootState} from "redux/rootReducer";
import {newBattle} from "model/instances/battleInstances";
import {
    calculateBattlePartyUnitsPower,
    calculateBattleSummary,
    calculatePartyDamage,
    calculateUnitPower
} from "model/logic/battleLogic";

export interface BattlesState {
    battles: Battle[];
    nextBattleId: number;
}

interface AddOrRemoveUnitPayload {battleIndex: number, unit: Unit}

interface SetTakenDamagePayload {battleIndex: number, rovania: BattlePartyUnitsDamage, brander: BattlePartyUnitsDamage}

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

        _addUnitToBattle: (state, {payload: {battleIndex, unit}}: PayloadAction<AddOrRemoveUnitPayload>) => {
            const battle = state.battles[battleIndex];

            if (battle) {
                const party = unit.path[0] === 0 ? battle.rovania : battle.brander;

                const allAddedUnits = getAllSubunits(unit);
                party.allBattlingUnits.push(...allAddedUnits.map(unit => unit.path));

                const addUnitsOfType = (type: UnitType) =>
                    party[type].units.push(...filterUnitsByType(allAddedUnits, type).map(unit => ({
                        path: unit.path,
                        power: calculateUnitPower(unit, party[unit.type].tactic),
                        takenDamage: {
                            manpowerDamage: 0,
                            moraleDamage: 0
                        }
                    })));

                addUnitsOfType(UnitType.infantry);
                addUnitsOfType(UnitType.cavalry);
                addUnitsOfType(UnitType.artillery);
            }
        },

        _removeUnitFromBattle: (state, {payload: {battleIndex, unit}}: PayloadAction<AddOrRemoveUnitPayload>) => {
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

        _setBattleTactic: (state, {payload: {battleIndex, party, tactic, unitType}}: PayloadAction<SetBattleTacticActionPayload>) => {
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
        _updateUnitsPower: (state, {payload: {battleIndex, rovania, brander}}: PayloadAction<{battleIndex: number, rovania: BattlePartyUnitsPower, brander: BattlePartyUnitsPower}>) => {
            const battle = state.battles[battleIndex];

            const setPowerForType = (type: UnitType) => {
                battle.rovania[type].units.forEach((unit, i) =>
                    unit.power = rovania[type][i]
                );

                battle.brander[type].units.forEach((unit, i) =>
                    unit.power = brander[type][i]
                );
            }

            setPowerForType(UnitType.infantry);
            setPowerForType(UnitType.cavalry);
            setPowerForType(UnitType.artillery);
        },
        _changeBattleConditions: (state, {payload: {battleIndex, field, value}}: PayloadAction<{battleIndex: number, field: keyof BattleConditions, value: number}>) => {
            state.battles[battleIndex].battleConditions[field] = value;
        },
        _updateBattleSummaries: (state, {payload: {battleIndex, rovania, brander}}: PayloadAction<{battleIndex: number, rovania: BattleSummary, brander: BattleSummary}>) => {
            state.battles[battleIndex].rovania.battleSummary = rovania;
            state.battles[battleIndex].brander.battleSummary = brander;
        },
        _setTakenDamage: (state, {payload: {battleIndex, rovania, brander}}: PayloadAction<SetTakenDamagePayload>) => {
            const battle = state.battles[battleIndex];

            const setDamageForType = (type: UnitType) => {
                battle.rovania[type].units.forEach((unit, i) =>
                    unit.takenDamage = rovania[type][i]
                );

                battle.brander[type].units.forEach((unit, i) =>
                    unit.takenDamage = brander[type][i]
                );
            }

            setDamageForType(UnitType.infantry);
            setDamageForType(UnitType.cavalry);
            setDamageForType(UnitType.artillery);
        }
    }
});

const {_setBattleTactic, _updateUnitsPower, _changeBattleConditions, _updateBattleSummaries, _setTakenDamage} = battles.actions;

/****** EXPORT ******/

export const {_addUnitToBattle, _removeUnitFromBattle, addBattle, changeUnitPower} = battles.actions;

export const addUnitToBattle = ({battleIndex, unit}: AddOrRemoveUnitPayload): ThunkAction<void, RootState, unknown, Action<unknown>> =>
    dispatch => {
    dispatch(_addUnitToBattle({battleIndex, unit}));
    dispatch(calculate(battleIndex));
};

export const removeUnitFromBattle = ({battleIndex, unit}: AddOrRemoveUnitPayload): ThunkAction<void, RootState, unknown, Action<unknown>> =>
    dispatch => {
    dispatch(_removeUnitFromBattle({battleIndex, unit}));
    dispatch(calculate(battleIndex));
};

export const setBattleTactic = ({battleIndex, party, tactic, unitType}: SetBattleTacticActionPayload): ThunkAction<void, RootState, unknown, Action<unknown>> =>
    dispatch => {
        dispatch(_setBattleTactic({battleIndex, party, tactic, unitType}));
        dispatch(calculate(battleIndex));
    }

export const changeBattleConditions = (battleIndex: number, field: keyof BattleConditions, value: number): ThunkAction<void, RootState, unknown, Action<unknown>> => dispatch => {
    dispatch(_changeBattleConditions({battleIndex, field, value}));
    dispatch(calculate(battleIndex));
}

const calculate = (battleIndex: number): ThunkAction<void, RootState, unknown, Action<unknown>> => (dispatch, getState) => {
    let battle = getState().battles.battles[battleIndex];

    dispatch(_updateUnitsPower({
        battleIndex,
        rovania: calculateBattlePartyUnitsPower(battle['rovania'], getState().armiesState.armies),
        brander: calculateBattlePartyUnitsPower(battle['brander'], getState().armiesState.armies),
    }));

    battle = getState().battles.battles[battleIndex];

    dispatch(_updateBattleSummaries({
        battleIndex,
        rovania: calculateBattleSummary(battle, 'rovania'),
        brander: calculateBattleSummary(battle, 'brander')
    }));

    battle = getState().battles.battles[battleIndex];

    dispatch(_setTakenDamage({
        battleIndex,
        rovania: calculatePartyDamage(battle, 'rovania'),
        brander: calculatePartyDamage(battle, 'brander')
    }))
}

export const calculateAll = (): ThunkAction<void, RootState, unknown, Action<unknown>> => (dispatch, getState) => {
    getState().battles.battles.forEach((_, i) => {
        dispatch(calculate(i));
    })
}

export default battles.reducer;