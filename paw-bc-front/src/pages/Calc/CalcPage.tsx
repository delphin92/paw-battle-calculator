import React from "react";
import {Col, Row} from "react-bootstrap";
import ArmyCard from "pages/Calc/ArmyCard";

interface CalcPageProps {

}

const CalcPage: React.FC<CalcPageProps> = () => (
    <>
        <Row>
            <Col md={6}>
                <ArmyCard party="rovania"/>
            </Col>
            <Col md={6}>
                <ArmyCard party="brander"/>
            </Col>
        </Row>
    </>
);

export default CalcPage;