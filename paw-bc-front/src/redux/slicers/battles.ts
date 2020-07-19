import {Action, createSlice, PayloadAction, ThunkAction} from "@reduxjs/toolkit";
import {
    Battle,
    BattleConditions,
    BattlePartyUnitsDamage, BattlePartyUnitsCharacteristic,
    BattleSummary,
    BattlingUnit,
    Tactic
} from "model/battle";
import {
    BattleCharacteristic,
    filterUnitsByType,
    getAllSubunits,
    parties,
    Party,
    Unit,
    UnitLeaf,
    unitPathsEq,
    UnitType
} from "model/army";
import {remove} from "lodash";
import {RootState} from "redux/rootReducer";
import {newBattle} from "model/instances/battleInstances";
import {
    calculateBattlePartyUnitsCharacteristic,
    calculateBattleSummary,
    calculatePartyDamage,
    calculateUnitCharacteristic, generateReport
} from "model/logic/battleLogic";

export interface BattlesState {
    battles: Battle[];
    nextBattleId: number;
}

interface AddOrRemoveUnitPayload {battleIndex: number, unit: Unit}
interface ChangeUnitData {battleIndex: number, unit: UnitLeaf, field: keyof BattlingUnit | keyof BattleCharacteristic, value: any}
// interface ChangeUnitData {battleIndex: number, party: Party, type: UnitType, index: number, field: keyof BattlingUnit, value: any}
interface SetTakenDamagePayload {battleIndex: number, rovania: BattlePartyUnitsDamage, brander: BattlePartyUnitsDamage}
interface SetReportPayload {battleIndex: number, rovania: string, brander: string}

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
                        battleCharacteristic: calculateUnitCharacteristic(unit, party[unit.type].tactic),
                        damageDistributionCoefficient: 1,
                        takenDamage: {
                            manpowerDamage: 0,
                            moraleDamage: 0,
                            disorder: 0
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
        _changeUnitData:(state, {payload: {battleIndex, unit, field, value}}: PayloadAction<ChangeUnitData>) => {
            const battlingUnit = state.battles[battleIndex][parties[unit.path[0]]][unit.type].units
                .find(battlingUnit => unitPathsEq(battlingUnit.path, unit.path));

            if (battlingUnit) {
                if (field in battlingUnit) {
                    battlingUnit[field as keyof BattlingUnit] = value
                } else {
                    battlingUnit.battleCharacteristic[field as keyof BattleCharacteristic] = value
                }
            }
        },
        // _changeUnitData:(state, {payload: {battleIndex, party, type, index, field, value}}: PayloadAction<ChangeUnitData>) => {
        //     state.battles[battleIndex][party][type].units[index][field] = value;
        // },

        changeUnitPower: (state, {payload: {battleIndex, unit, power}}: PayloadAction<{battleIndex: number, unit: UnitLeaf, power: number}>) => {
            const battle = state.battles[battleIndex];

            if (battle) {
                const party = unit.path[0] === 0 ? battle.rovania : battle.brander;

                const stUnit = party[unit.type].units.find(battlingUnit => unitPathsEq(battlingUnit.path, unit.path)) as BattlingUnit;

                stUnit.battleCharacteristic.power = power;
            }
        },
        _updateUnitsCharacteristic: (state, {payload: {battleIndex, rovania, brander}}: PayloadAction<{battleIndex: number, rovania: BattlePartyUnitsCharacteristic, brander: BattlePartyUnitsCharacteristic}>) => {
            const battle = state.battles[battleIndex];

            const setPowerForType = (type: UnitType) => {
                battle.rovania[type].units.forEach((unit, i) => {
                    unit.battleCharacteristic.power = rovania[type][i].power;
                    unit.battleCharacteristic.pursuit = rovania[type][i].pursuit;
                });

                battle.brander[type].units.forEach((unit, i) => {
                    unit.battleCharacteristic.power = brander[type][i].power;
                    unit.battleCharacteristic.pursuit = brander[type][i].pursuit;
                });
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
        },
        _setReport: (state, {payload: {battleIndex, rovania, brander}}: PayloadAction<SetReportPayload>) => {
            state.battles[battleIndex].rovania.report = rovania;
            state.battles[battleIndex].brander.report = brander;
        }
    }
});

const {_setBattleTactic, _changeUnitData, _updateUnitsCharacteristic, _changeBattleConditions, _updateBattleSummaries, _setTakenDamage, _setReport} = battles.actions;

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

export const changeUnitData = (battleIndex: number, unit: UnitLeaf, field: keyof BattlingUnit | keyof BattleCharacteristic, value: any): ThunkAction<void, RootState, unknown, Action<unknown>> => dispatch => {
    dispatch(_changeUnitData({battleIndex, unit, field, value}));
    dispatch(calculate(battleIndex));
}

export const changeBattleConditions = (battleIndex: number, field: keyof BattleConditions, value: number): ThunkAction<void, RootState, unknown, Action<unknown>> => dispatch => {
    dispatch(_changeBattleConditions({battleIndex, field, value}));
    dispatch(calculate(battleIndex));
}

const calculate = (battleIndex: number): ThunkAction<void, RootState, unknown, Action<unknown>> => (dispatch, getState) => {
    let battle = getState().battles.battles[battleIndex];

    dispatch(_updateUnitsCharacteristic({
        battleIndex,
        rovania: calculateBattlePartyUnitsCharacteristic(battle['rovania'], getState().armiesState.armies),
        brander: calculateBattlePartyUnitsCharacteristic(battle['brander'], getState().armiesState.armies),
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

    battle = getState().battles.battles[battleIndex];

    dispatch(_setReport({
        battleIndex,
        rovania: generateReport(battle, 'rovania', getState().armiesState.armies),
        brander: generateReport(battle, 'brander', getState().armiesState.armies)
    }))
}

export const calculateAll = (): ThunkAction<void, RootState, unknown, Action<unknown>> => (dispatch, getState) => {
    getState().battles.battles.forEach((_, i) => {
        dispatch(calculate(i));
    })
}

export default battles.reducer;