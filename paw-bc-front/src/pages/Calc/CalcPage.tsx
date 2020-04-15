import React from "react";
import {Col, Row, Nav, Button} from "react-bootstrap";
import ArmyCard from "pages/Calc/ArmyCard";
import { RouteComponentProps, Link } from "react-router-dom";
import {connect} from "react-redux";
import {RootState} from "redux/rootReducer";
import {Battle} from "model/battle";
import {BattlesState, addBattle} from "redux/slicers/battles";
import { FaPlus } from "react-icons/fa";
import BattleCard from "./BattleCard";

interface CalcPageProps {
    battle: Battle;
}

interface CalcPageDispatchedProps {
    addBattle: () => void;
}

const CalcPage: React.FC<CalcPageProps & BattlesState & RouteComponentProps<{battleIndex: string}> & CalcPageDispatchedProps> =
        ({battles, match: {params}, addBattle}) => {
    return (
        <>
            <Nav variant="tabs" activeKey={params.battleIndex}>
                {battles.map((battle, index) =>
                    <Nav.Item key={index}>
                        <Nav.Link as={Link} to={'/calc/' + index} eventKey={index}>{battle.place}</Nav.Link>
                    </Nav.Item>
                )}

                <Nav.Item onClick={() => addBattle()}>
                    <Button size="sm"><FaPlus/></Button>
                </Nav.Item>
            </Nav>

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
        </>
    );
};

export default connect(
    (state: RootState, ownProps: RouteComponentProps<{battleIndex: string}>) => ({
        battle: state.battles.battles[parseInt(ownProps.match.params.battleIndex)] as Battle,
        ...state.battles
    }),
    {addBattle}
)(CalcPage);