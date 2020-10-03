import {Action, createSlice, PayloadAction, ThunkAction} from "@reduxjs/toolkit";
import {armies} from "data/army";
import {Armies, getByPath, UnitLeaf, UnitType} from "model/army";
import {UnitDamage} from "model/battle";
import {RootState} from "redux/rootReducer";
import {getDamage} from "model/logic/battleLogic";
import {calculateAll} from "redux/slicers/battles";
import { addBattleIntoLog } from "./battlesLog";

interface ArmiesState {
    armies: Armies;
}

type takeDamagePayload = UnitDamage[];

const armiesState = createSlice({
    name: 'armiesState',
    initialState: {
        armies
    } as ArmiesState,
    reducers: {
        _takeDamage: (state, {payload: unitsDamage}: PayloadAction<takeDamagePayload>) => {
            unitsDamage.forEach(damage => {
                const unit = getByPath(state.armies, damage.unit) as UnitLeaf;
                unit.manpower -= damage.manpowerDamage;
                unit.morale -= damage.moraleDamage;
            });
        },
        _changeUnitData: (state, {payload: {unit, field, value}}: PayloadAction<{unit: UnitLeaf, field: keyof UnitLeaf, value: number}>) => {
            const stateUnit = getByPath(state.armies, unit.path) as UnitLeaf;
            // @ts-ignore
            stateUnit[field] = value;
        }
    }
});

const {_takeDamage, _changeUnitData} = armiesState.actions;

export const changeUnitData = (unit: UnitLeaf, field: keyof UnitLeaf, value: number): ThunkAction<void, RootState, unknown, Action<unknown>> => dispatch => {
    dispatch(_changeUnitData({unit, field, value}));
}

export const applyBattleDamage = (battleIndex: number): ThunkAction<void, RootState, unknown, Action<unknown>> => (dispatch, getState) => {
    const battle = getState().battles.battles[battleIndex];

    const allDamage = [
        ...battle.rovania[UnitType.infantry].units.map(getDamage),
        ...battle.rovania[UnitType.cavalry].units.map(getDamage),
        ...battle.rovania[UnitType.artillery].units.map(getDamage),
        ...battle.brander[UnitType.infantry].units.map(getDamage),
        ...battle.brander[UnitType.cavalry].units.map(getDamage),
        ...battle.brander[UnitType.artillery].units.map(getDamage),
    ];

    dispatch(addBattleIntoLog(battle));
    dispatch(_takeDamage(allDamage));
    dispatch(calculateAll())
}

export default armiesState.reducer;