import React from "react";
import {Card, Col, Row} from "react-bootstrap";
import {Party, UnitType} from "model/army";
import {BattleParty} from "model/battle";
import {connect} from "react-redux";
import {RootState} from "redux/rootReducer";
import BattleDamage from "pages/Calc/BattleDamage";

interface BattleDamageCardProps {
    battleIndex: number;
    party: Party;
}

interface BattleDamageCardState {
    battleParty: BattleParty;
}

const BattleDamageCard: React.FC<BattleDamageCardProps & BattleDamageCardState> = ({battleParty}) => (
    <Card>
        <Card.Header>
            <strong>Потери</strong>
        </Card.Header>
        <Card.Body>
            <Row>
                <Col xs={4}>
                    <strong>Подразделение</strong>
                </Col>
                <Col xs={4}>
                    <strong>Люди</strong>
                </Col>
                <Col xs={4}>
                    <strong>Боевой дух</strong>
                </Col>
            </Row>

            <BattleDamage type={UnitType.infantry} battleParty={battleParty}/>
            <BattleDamage type={UnitType.cavalry} battleParty={battleParty}/>
            <BattleDamage type={UnitType.artillery} battleParty={battleParty}/>
        </Card.Body>
    </Card>
);

export default connect(
    (state: RootState, ownProps: BattleDamageCardProps) => ({
        battleParty: state.battles.battles[ownProps.battleIndex][ownProps.party]
    })
)(BattleDamageCard);