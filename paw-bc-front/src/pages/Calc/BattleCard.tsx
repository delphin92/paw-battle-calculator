import React from "react";
import {Card, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import {RouteComponentProps, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {RootState} from "redux/rootReducer";
import {Battle, BattleTactic} from "model/battle";
import {Unit, UnitPath} from "model/army";
import {removeUnitFromBattle, setBattleTactic} from "redux/slicers/battles";

interface BattleCardProps {
    party: 'rovania' | 'brander';
}

interface BattleCardState {
    battle: Battle;
    units: UnitPath[];
    tactic: BattleTactic;
}

interface BattleCardDispatched {
    setBattleTactic: (tactic: BattleTactic) => void;
    removeUnitFromBattle: (unit: Unit) => void;
}

const BattleCard: React.FC<BattleCardProps & BattleCardState & BattleCardDispatched> = ({tactic, setBattleTactic}) => (
    <Card>
        <Card.Body>
            <ToggleButtonGroup type="radio" name="tactic" value={tactic} onChange={setBattleTactic}>
                <ToggleButton value={BattleTactic.skirmish}>{BattleTactic.skirmish}</ToggleButton>
                <ToggleButton value={BattleTactic.firefight}>{BattleTactic.firefight}</ToggleButton>
                <ToggleButton value={BattleTactic.columnAttack}>{BattleTactic.columnAttack}</ToggleButton>
                <ToggleButton value={BattleTactic.square}>{BattleTactic.square}</ToggleButton>
            </ToggleButtonGroup>

        </Card.Body>
    </Card>
);

export default withRouter(connect(
    (state: RootState, {party, match: {params}}: BattleCardProps & RouteComponentProps<{battleIndex: string}>) => ({
        battle: state.battles.battles[parseInt(params.battleIndex)],
        units: state.battles.battles[parseInt(params.battleIndex)].units[party],
        tactic: state.battles.battles[parseInt(params.battleIndex)].tactic[party]
    }),
    (dispatch, {party, match: {params: {battleIndex}}}) => ({
        setBattleTactic: (tactic: BattleTactic) => dispatch(setBattleTactic({tactic, party, battleIndex: parseInt(battleIndex)})),
        removeUnitFromBattle: (unit: Unit) => dispatch(removeUnitFromBattle({unit, battleIndex: parseInt(battleIndex)}))
    })
)(BattleCard));