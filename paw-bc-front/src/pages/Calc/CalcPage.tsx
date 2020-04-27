import React from "react";
import {Col, Row, Nav, Button} from "react-bootstrap";
import ArmyCard from "pages/Calc/ArmyCard";
import { RouteComponentProps, Link } from "react-router-dom";
import {connect} from "react-redux";
import {RootState} from "redux/rootReducer";
import {Battle} from "model/battle";
import {BattlesState, addBattle} from "redux/slicers/battles";
import {applyBattleDamage} from "redux/slicers/armiesState";
import { FaPlus } from "react-icons/fa";
import BattleCard from "./BattleCard";
import BattleConditionsCard from "pages/Calc/BattleConditionsCard";
import BattleSummaryCard from "pages/Calc/BattleSummaryCard";
import BattleDamageCard from "pages/Calc/BattleDamageCard";
import ReportCard from "pages/Calc/ReportCard";

interface CalcPageProps {
    battle: Battle;
}

interface CalcPageDispatchedProps {
    addBattle: () => void;
    applyBattleDamage: (battleIndex: number) => void;
}

const CalcPage: React.FC<CalcPageProps & BattlesState & RouteComponentProps<{battleIndex: string}> & CalcPageDispatchedProps> =
        ({battles, match: {params}, addBattle, applyBattleDamage}) => {
    const battleIndex = parseInt(params.battleIndex);

    return (
        <>
            <Nav variant="tabs" activeKey={battleIndex}>
                {battles.map((battle, index) =>
                    <Nav.Item key={index}>
                        <Nav.Link as={Link} to={'/calc/' + index} eventKey={index}>{battle.place}</Nav.Link>
                    </Nav.Item>
                )}

                <Nav.Item onClick={() => addBattle()}>
                    <Button size="sm"><FaPlus/></Button>
                </Nav.Item>
            </Nav>

            <BattleConditionsCard battleIndex={battleIndex}/>

            <Row>
                <Col md={6}>
                    <ArmyCard party="rovania"/>
                </Col>
                <Col md={6}>
                    <ArmyCard party="brander"/>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <BattleCard party="rovania"/>
                </Col>
                <Col md={6}>
                    <BattleCard party="brander"/>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <BattleSummaryCard battleIndex={battleIndex} party="rovania"/>
                </Col>
                <Col md={6}>
                    <BattleSummaryCard battleIndex={battleIndex} party="brander"/>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <BattleDamageCard battleIndex={battleIndex} party="rovania"/>
                </Col>
                <Col md={6}>
                    <BattleDamageCard battleIndex={battleIndex} party="brander"/>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <ReportCard battleIndex={battleIndex} party="rovania"/>
                </Col>
                <Col md={6}>
                    <ReportCard battleIndex={battleIndex} party="brander"/>
                </Col>
            </Row>

            <div className="d-flex justify-content-center">
                <Button onClick={() => applyBattleDamage(battleIndex)}>Применить результат</Button>
            </div>
        </>
    );
};

export default connect(
    (state: RootState, ownProps: RouteComponentProps<{battleIndex: string}>) => ({
        battle: state.battles.battles[parseInt(ownProps.match.params.battleIndex)] as Battle,
        ...state.battles
    }),
    {addBattle, applyBattleDamage}
)(CalcPage);