import React from "react";
import {Battle} from "model/battle";
import {Col, Row} from "react-bootstrap";
import {BattleSummaryCard} from "pages/Calc/BattleSummaryCard";

interface BattleLogItemProps {
    battle: Battle;
}

const BattleLogItem: React.FC<BattleLogItemProps> = ({battle}) => (
    <Row>
        <Col xs={6}>
            <BattleSummaryCard battleSummary={battle.rovania.battleSummary}/>
        </Col>
        <Col xs={6}>
            <BattleSummaryCard battleSummary={battle.brander.battleSummary}/>
        </Col>
    </Row>
);

export default BattleLogItem;