import React from "react";
import {Card, Col, Row} from "react-bootstrap";
import {Party, UnitType} from "model/army";
import {BattleParty} from "model/battle";
import {connect} from "react-redux";
import {RootState} from "redux/rootReducer";
import BattleDamage from "pages/Calc/BattleDamage";
import {calculateResultRate} from "model/logic/battleLogic";

interface BattleDamageCardProps {
    battleIndex: number;
    party: Party;
}

interface BattleDamageCardState {
    battleParty: BattleParty;
    resultRate: number;
}

const BattleDamageCard: React.FC<BattleDamageCardProps & BattleDamageCardState> = ({battleParty, resultRate}) => (
    <Card>
        <Card.Header>
            <strong>Результаты боя</strong>
        </Card.Header>
        <Card.Body>
            <Row>
                <Col xs={4}><strong>Результат</strong></Col>
                <Col xs={8}>
                    {!isNaN(resultRate)
                        ? resultRate.toFixed(2)
                        : ''
                    }
                </Col>
            </Row>

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
        battleParty: state.battles.battles[ownProps.battleIndex][ownProps.party],
        resultRate: calculateResultRate(state.battles.battles[ownProps.battleIndex], ownProps.party)
    })
)(BattleDamageCard);