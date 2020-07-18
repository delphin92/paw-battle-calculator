import React from "react";
import {BattleParty} from "model/battle";
import {Armies, getByPath, UnitType} from "model/army";
import {connect} from "react-redux";
import {RootState} from "redux/rootReducer";
import {Col, Row} from "react-bootstrap";

interface BattleDamageProps {
    // battleIndex: number;
    battleParty: BattleParty;
    type: UnitType
}

interface BattleDamageState {
    armies: Armies;
}

const BattleDamage: React.FC<BattleDamageProps & BattleDamageState> = ({type, battleParty, armies}) => (
    <div>
        <div><strong>{type}</strong></div>

        {battleParty[type].units.map((unit, i) =>
            <Row key={i}>
                <Col xs={4}>{getByPath(armies, unit.path).name}</Col>
                <Col xs={4}>{unit.takenDamage.manpowerDamage.toFixed(2)}</Col>
                <Col xs={4}>{unit.takenDamage.moraleDamage.toFixed(2)}</Col>
            </Row>
        )}
    </div>
);

export default connect(
    (state: RootState) => ({armies: state.armiesState.armies})
)(BattleDamage);