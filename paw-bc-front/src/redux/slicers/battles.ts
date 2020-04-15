import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Battle, BattleTactic} from "model/battle";
import {Unit, unitPathsEq} from "model/army";

export interface BattlesState {
    battles: Battle[];
    nextBattleId: number;
}

const newBattle = (id: number): Battle => ({
    id,
    place: 'Битва ' + id,
    rovania: {
        tactic: BattleTactic.skirmish,
        units: []
    },
    brander: {
        tactic: BattleTactic.skirmish,
        units: []
    }
})

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
                const units = unit.path[0] === 0 ? battle.rovania.units : battle.brander.units;
                units.push(unit.path);
            }
        },

        removeUnitFromBattle: (state, {payload: {battleIndex, unit}}: PayloadAction<{battleIndex: number, unit: Unit}>) => {
            const battle = state.battles[battleIndex];

            if (battle) {
                const units = unit.path[0] === 0 ? battle.rovania.units : battle.brander.units;
                const unitIndex = units.findIndex(path => unitPathsEq(path, unit.path));
                units.splice(unitIndex, 1);
            }
        },

        setBattleTactic: (state, {payload: {battleIndex, party, tactic}}: PayloadAction<{battleIndex: number, party: 'rovania' | 'brander', tactic: BattleTactic}>) => {
            state.battles[battleIndex][party].tactic = tactic;
        }
    }
});

/****** EXPORT ******/

export const {addUnitToBattle, removeUnitFromBattle, addBattle, setBattleTactic} = battles.actions;

export default battles.reducer;