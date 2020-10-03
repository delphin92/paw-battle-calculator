import React from "react";
import {Col, Row} from "react-bootstrap";
import ArmyTree from "pages/Army/ArmyTree/ArmyTree";

interface ArmyPageProps {

}

const ArmyPage: React.FC<ArmyPageProps> = () => (
    <>
        <Row>
            <Col md={6}>
                <ArmyTree party="rovania"/>
            </Col>
            <Col md={6}>
                <ArmyTree party="brander"/>
            </Col>
        </Row>
    </>
);

export default ArmyPage;