import {Action, createSlice, PayloadAction, ThunkAction} from "@reduxjs/toolkit";
import {
    ArtilleryTactic,
    Battle,
    BattleConditions, BattleSummary,
    BattlingUnit,
    Tactic
} from "model/battle";
import {filterUnitsByType, getAllSubunits, getByPath, Party, Unit, UnitLeaf, unitPathsEq, UnitType} from "model/army";
import {remove, sumBy} from "lodash";
import {RootState} from "redux/rootReducer";
import {newBattle} from "model/instances/battleInstances";

export interface BattlesState {
    battles: Battle[];
    nextBattleId: number;
}

interface AddOrRemoveUnitPayload {battleIndex: number, unit: Unit}


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
                        power: unit.power?.[party[unit.type].tactic] ?? 0
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

        changeUnitPower: (state, {payload: {battleIndex, unit, power}}: PayloadAction<{battleIndex: number, unit: UnitLeaf, power: number}>) => {
            const battle = state.battles[battleIndex];

            if (battle) {
                const party = unit.path[0] === 0 ? battle.rovania : battle.brander;

                const stUnit = party[unit.type].units.find(battlingUnit => unitPathsEq(battlingUnit.path, unit.path)) as BattlingUnit;

                stUnit.power = power;
            }
        },
        _updateUnitsPower: (state, {payload: {battleIndex, party, unitType, powers}}: PayloadAction<{battleIndex: number, party: Party, unitType: UnitType, powers: number[]}>) => {

            state.battles[battleIndex][party][unitType].units.forEach((battlingUnit, i) => {
                battlingUnit.power = powers[i]
            })
        },
        _changeBattleConditions: (state, {payload: {battleIndex, field, value}}: PayloadAction<{battleIndex: number, field: keyof BattleConditions, value: number}>) => {
            state.battles[battleIndex].battleConditions[field] = value;
        },
        _updateBattleSummaries: (state, {payload: {battleIndex, rovania, brander}}: PayloadAction<{battleIndex: number, rovania: BattleSummary, brander: BattleSummary}>) => {
            state.battles[battleIndex].rovania.battleSummary = rovania;
            state.battles[battleIndex].brander.battleSummary = brander;
        }
    }
});

const {_setBattleTactic, _updateUnitsPower, _changeBattleConditions, _updateBattleSummaries} = battles.actions;

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
    (dispatch, getState) => {
        dispatch(_setBattleTactic({battleIndex, party, tactic, unitType}));

        const state = getState();
        const armies = state.armiesState.armies;
        const battleParty = state.battles.battles[battleIndex][party];

        const powers = battleParty[unitType].units
            .map(battlingUnit => getByPath(armies, battlingUnit.path) as UnitLeaf)
            .map(unit => unit.power[tactic] ?? 0)

        dispatch(_updateUnitsPower({battleIndex, party, unitType, powers}));
        dispatch(calculate(battleIndex));
    }

export const changeBattleConditions = (battleIndex: number, field: keyof BattleConditions, value: number): ThunkAction<void, RootState, unknown, Action<unknown>> => dispatch => {
    dispatch(_changeBattleConditions({battleIndex, field, value}));
}

const calculate = (battleIndex: number): ThunkAction<void, RootState, unknown, Action<unknown>> => (dispatch, getState) => {
    const state = getState();
    const battle = state.battles.battles[battleIndex];

    dispatch(_updateBattleSummaries({
        battleIndex,
        rovania: calculateBattleSummary(battle, 'rovania'),
        brander: calculateBattleSummary(battle, 'brander')
    }));
}

const calculateBattleSummary = (battle: Battle, party: Party): BattleSummary => {
    const battleParty = battle[party];
    const enemyParty = battle[party === 'rovania' ? 'brander' : 'rovania'];

    let totalPower = 0;

    const infantryPower = sumBy(battleParty[UnitType.infantry].units, unit => unit.power);
    const cavalryPower = sumBy(battleParty[UnitType.cavalry].units, unit => unit.power);
    const artilleryPower = sumBy(battleParty[UnitType.artillery].units, unit => unit.power);

    totalPower += infantryPower;

    // if (battleParty[UnitType.cavalry].tactic === CavalryTactic.support) {
    //     if (battleParty[UnitType.infantry].tactic === InfantryTactic.firefight ||
    //         battleParty[UnitType.infantry].tactic === InfantryTactic.columnAttack) {

            const enemyCavalryPower = sumBy(enemyParty[UnitType.cavalry].units, unit => unit.power);
            const cavalrySupportBonus = (cavalryPower - enemyCavalryPower) *
                (1 - 0.1 * battle.battleConditions.cavalryPenalty);
            totalPower += cavalrySupportBonus
    //     }
    // }

    let artillerySupportBonus = 0;

    if (battleParty[UnitType.artillery].tactic === ArtilleryTactic.support) {
        if (enemyParty[UnitType.artillery].tactic === ArtilleryTactic.artillerySuppression) {
            const enemyArtilleryPower = sumBy(enemyParty[UnitType.artillery].units, unit => unit.power);
            artillerySupportBonus = artilleryPower - enemyArtilleryPower;
        } else {
            artillerySupportBonus = artilleryPower;
        }

        totalPower += artillerySupportBonus;
    }

    return {
        infantryPower,
        cavalryPower,
        artilleryPower,
        cavalrySupportBonus,
        artillerySupportBonus,
        totalPower
    };
}

export default battles.reducer;