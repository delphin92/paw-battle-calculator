import { createSlice } from "@reduxjs/toolkit";
import {armies} from "data/army";

const armiesState = createSlice({
    name: 'armiesState',
    initialState: {
        armies
    },
    reducers: {

    }
});

export const {} = armiesState;

export default armiesState.reducer;