import React from "react";
import {Card, Col, Row} from "react-bootstrap";
import {connect} from "react-redux";
import {RootState} from "redux/rootReducer";
import {Party, UnitType} from "model/army";
import {BattleParty, BattleSummary} from "model/battle";
import {mn} from "utils";

interface BattleSummaryCardProps {
    battleIndex: number;
    party: Party;
}

interface BattleSummaryCardState {
    battleParty: BattleParty;
}

export const BattleSummaryCard: React.FC<BattleSummaryCardState> = ({battleParty}) => {
    const battleSummary: BattleSummary = battleParty.battleSummary;

    return (
        <Card>
            <Card.Body>
                <Row>
                    <Col xs={3}>
                        <strong>Род войск</strong>
                    </Col>
                    <Col xs={3}>
                        <strong>Тактика</strong>
                    </Col>
                    <Col xs={3}>
                        <strong>Сила</strong>
                    </Col>
                    <Col xs={3}>
                        <strong>Преслед</strong>
                    </Col>
                </Row>
                {
                    [
                        ['Пехота', battleParty[UnitType.infantry].tactic, battleSummary.infantryPower, battleSummary.infantryPursuit],
                        ['Кавалерия', battleParty[UnitType.cavalry].tactic, battleSummary.cavalryPower, battleSummary.cavalryPursuit],
                        ['Артиллерия', battleParty[UnitType.artillery].tactic, battleSummary.artilleryPower, 0],
                        ['Общее', '', battleSummary.totalPower, battleSummary.totalPursuit]
                    ].map(([name, tactic, power, pursuit], i) =>
                        <Row key={i}>
                            <Col xs={3}>
                                <strong>{name}</strong>
                            </Col>
                            <Col xs={3}>
                                {tactic}
                            </Col>
                            <Col xs={3}>
                                {mn(power).toFixed(2)}
                            </Col>
                            <Col xs={3}>
                                {mn(pursuit).toFixed(2)}
                            </Col>
                        </Row>
                    )
                }
            </Card.Body>
        </Card>
    );
};

export default connect(
    (state: RootState, {battleIndex, party}: BattleSummaryCardProps) => ({
        battleParty: state.battles.battles[battleIndex][party]
    }))
(BattleSummaryCard);