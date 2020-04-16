import React from "react";
import {Card, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import {RouteComponentProps, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {RootState} from "redux/rootReducer";
import {Battle, BattleParty, InfantryTactic, Tactic} from "model/battle";
import {Unit, UnitType} from "model/army";
import {removeUnitFromBattle, setBattleTactic} from "redux/slicers/battles";

interface BattleCardProps {
    party: 'rovania' | 'brander';
}

interface BattleCardState {
    battle: Battle;
    battleParty: BattleParty;
}

interface BattleCardDispatched {
    setBattleTactic: (unitType: UnitType, tactic: Tactic) => void;
    removeUnitFromBattle: (unit: Unit) => void;
}

const BattleCard: React.FC<BattleCardProps & BattleCardState & BattleCardDispatched> = ({battleParty, setBattleTactic}) => {
    const setInfantryTactic = (tactic: Tactic) => setBattleTactic(UnitType.infantry, tactic);

    return (
        <Card>
            <Card.Body>
                <ToggleButtonGroup type="radio" name="infantry-tactic"
                                   value={battleParty[UnitType.infantry].tactic}
                                   onChange={setInfantryTactic}
                >
                    <ToggleButton value={InfantryTactic.skirmish}>{InfantryTactic.skirmish}</ToggleButton>
                    <ToggleButton value={InfantryTactic.firefight}>{InfantryTactic.firefight}</ToggleButton>
                    <ToggleButton value={InfantryTactic.columnAttack}>{InfantryTactic.columnAttack}</ToggleButton>
                    <ToggleButton value={InfantryTactic.square}>{InfantryTactic.square}</ToggleButton>
                </ToggleButtonGroup>

            </Card.Body>
        </Card>
    );
};

export default withRouter(connect(
    (state: RootState, {party, match: {params}}: BattleCardProps & RouteComponentProps<{battleIndex: string}>) => ({
        battle: state.battles.battles[parseInt(params.battleIndex)],
        battleParty: state.battles.battles[parseInt(params.battleIndex)][party]
    }),
    (dispatch, {party, match: {params: {battleIndex}}}) => ({
        setBattleTactic: (unitType: UnitType, tactic: Tactic) => dispatch(setBattleTactic({unitType, tactic, party, battleIndex: parseInt(battleIndex)})),
        removeUnitFromBattle: (unit: Unit) => dispatch(removeUnitFromBattle({unit, battleIndex: parseInt(battleIndex)}))
    })
)(BattleCard));