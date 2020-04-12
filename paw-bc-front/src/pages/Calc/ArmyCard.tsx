import React from "react";
import {Card} from "react-bootstrap";
import ArmyTree from "components/ArmyTree/ArmyTree";
import {armies} from "data/army";

interface ArmyCardProps {
    party: 'rovania' | 'brander'
}

const ArmyCard: React.FC<ArmyCardProps> = ({party}) => (
    <Card>
        <Card.Body>
            <ArmyTree army={armies[party]}/>
        </Card.Body>
    </Card>
);

export default ArmyCard;