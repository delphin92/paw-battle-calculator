import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Battle} from "model/battle";
import {Unit, unitPathsEq} from "model/army";

export interface BattlesState {
    battles: Battle[];
    nextBattleId: number;
}

const battles = createSlice({
    name: 'battles',
    initialState: {
        battles: [{
            id: 0,
            place: 'Битва 0',
            units: {
                rovania: [],
                brander: []
            }
        }],
        nextBattleId: 0
    } as BattlesState,
    reducers: {
        addBattle: state => {
            state.battles.push({
                id: state.nextBattleId,
                place: 'Битва ' + state.nextBattleId,
                units: {
                    rovania: [],
                    brander: []
                }
            });

            state.nextBattleId += 1;
        },

        addUnitToBattle: (state, {payload: {battleIndex, unit}}: PayloadAction<{battleIndex: number, unit: Unit}>) => {
            const battle = state.battles[battleIndex];

            if (battle) {
                const party = unit.path[0] === 0 ? battle.units.rovania : battle.units.brander;
                party.push(unit.path);
            }
        },

        removeUnitFromBattle: (state, {payload: {battleIndex, unit}}: PayloadAction<{battleIndex: number, unit: Unit}>) => {
            const battle = state.battles[battleIndex];

            if (battle) {
                const party = unit.path[0] === 0 ? battle.units.rovania : battle.units.brander;
                const unitIndex = party.findIndex(path => unitPathsEq(path, unit.path));
                party.splice(unitIndex);
            }
        }
    }
});

/****** EXPORT ******/

export const {addUnitToBattle, removeUnitFromBattle, addBattle} = battles.actions;

export default battles.reducer;