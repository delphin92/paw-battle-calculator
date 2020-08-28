import React from "react";
import {Battle} from "model/battle";
import {Col, Row} from "react-bootstrap";
import BattleLogCard from "pages/BattlesLog/BattleLogCard";

interface BattleLogItemProps {
    battle: Battle;
}

const BattleLogItem: React.FC<BattleLogItemProps> = ({battle}) => (
    <Row>
        <Col xs={6}>
            <BattleLogCard battle={battle} party="rovania"/>
        </Col>
        <Col xs={6}>
            <BattleLogCard battle={battle} party="brander"/>
        </Col>
    </Row>
);

export default BattleLogItem;