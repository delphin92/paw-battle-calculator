import React from "react";
import {Card, Col, Row} from "react-bootstrap";
import {connect} from "react-redux";
import {RootState} from "redux/rootReducer";
import {Party} from "model/army";
import {BattleSummary} from "model/battle";

interface BattleSummaryCardProps {
    battleIndex: number;
    party: Party;
}

interface BattleSummaryCardState {
    battleSummary: BattleSummary;
}

const BattleSummaryCard: React.FC<BattleSummaryCardProps & BattleSummaryCardState> = ({battleSummary}) => (
    <Card>
        <Card.Body>
            <Row>
                <Col xs={4}>
                    <strong>Род войск</strong>
                </Col>
                <Col xs={4}>
                    <strong>Сила</strong>
                </Col>
                <Col xs={4}>
                    <strong>Преследование</strong>
                </Col>
            </Row>
            {
                [
                    ['Пехота', battleSummary.infantryPower, battleSummary.infantryPursuit],
                    ['Кавалерия', battleSummary.cavalryPower, battleSummary.cavalryPursuit],
                    ['Артиллерия', battleSummary.artilleryPower, 0],
                    ['Общее', battleSummary.totalPower, battleSummary.cavalryPursuit]
                ].map(([name, power, pursuit], i) =>
                    <Row key={i}>
                        <Col xs={4}>
                            <strong>{name}</strong>
                        </Col>
                        <Col xs={4}>
                            {(power as number).toFixed(2)}
                        </Col>
                        <Col xs={4}>
                            {(pursuit as number).toFixed(2)}
                        </Col>
                    </Row>
                )
            }
        </Card.Body>
    </Card>
);

export default connect(
    (state: RootState, {battleIndex, party}: BattleSummaryCardProps) => ({
        battleSummary: state.battles.battles[battleIndex][party].battleSummary
    }))
(BattleSummaryCard);