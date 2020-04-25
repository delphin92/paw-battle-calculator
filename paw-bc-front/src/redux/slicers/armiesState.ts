import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {armies} from "data/army";
import {Armies, getByPath, UnitLeaf} from "model/army";
import {UnitDamage} from "model/battle";

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
        takeDamage: (state, {payload: unitsDamage}: PayloadAction<takeDamagePayload>) => {
            unitsDamage.forEach(damage => {
                const unit = getByPath(state.armies, damage.unit) as UnitLeaf;
                unit.manpower -= damage.manpowerDamage;
                unit.morale -= damage.moraleDamage;
            });
        }
    }
});

export const {takeDamage} = armiesState.actions;

export default armiesState.reducer;