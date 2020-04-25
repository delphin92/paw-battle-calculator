import {Action, createSlice, PayloadAction, ThunkAction} from "@reduxjs/toolkit";
import {armies} from "data/army";
import {Armies, getByPath, UnitLeaf, UnitType} from "model/army";
import {UnitDamage} from "model/battle";
import {RootState} from "redux/rootReducer";
import {getDamage} from "model/logic/battleLogic";

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
        }
    }
});

const {_takeDamage} = armiesState.actions;

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

    dispatch(_takeDamage(allDamage));
}

export default armiesState.reducer;