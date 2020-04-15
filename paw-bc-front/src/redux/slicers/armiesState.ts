import { createSlice } from "@reduxjs/toolkit";
import {armies} from "data/army";
import {Armies} from "model/army";

interface ArmiesState {
    armies: Armies;
}

const armiesState = createSlice({
    name: 'armiesState',
    initialState: {
        armies
    } as ArmiesState,
    reducers: {

    }
});

export const {} = armiesState;

export default armiesState.reducer;