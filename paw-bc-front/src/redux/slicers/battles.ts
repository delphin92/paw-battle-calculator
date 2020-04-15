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
    tactic: {
        rovania: BattleTactic.skirmish,
        brander: BattleTactic.skirmish
    },
    units: {
        rovania: [],
        brander: []
    }
})

const battles = createSlice({
    name: 'battles',
    initialState: {
        battles: [newBattle(0)],
        nextBattleId: 0
    } as BattlesState,
    reducers: {
        addBattle: state => {
            state.battles.push(newBattle(state.nextBattleId));

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
        },

        setBattleTactic: (state, {payload: {battleIndex, party, tactic}}: PayloadAction<{battleIndex: number, party: 'rovania' | 'brander', tactic: BattleTactic}>) => {
            state.battles[battleIndex].tactic[party] = tactic;
        }
    }
});

/****** EXPORT ******/

export const {addUnitToBattle, removeUnitFromBattle, addBattle, setBattleTactic} = battles.actions;

export default battles.reducer;