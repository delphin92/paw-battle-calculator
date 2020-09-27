import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {BattlesLog} from "model/battleLogTypes";
import {Battle} from "model/battle";

export interface BattleLogState {
    battlesLog: BattlesLog;
}

const battlesLog = createSlice({
    name: 'battlesLog',
    initialState: {
        battlesLog: {}
    } as BattleLogState,
    reducers: {
        addBattleIntoLog: (state, {payload: battle}: PayloadAction<Battle>) => {
            const log = state.battlesLog[battle.id];

            if (log) {
                log.push(battle);
            } else {
                state.battlesLog[battle.id] = [battle];
            }
        }
    }
});

/****** EXPORT ******/

export const {addBattleIntoLog} = battlesLog.actions;

export default battlesLog.reducer;