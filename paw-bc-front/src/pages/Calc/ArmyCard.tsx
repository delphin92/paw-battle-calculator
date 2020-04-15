import React from "react";
import {Card} from "react-bootstrap";
import ArmyTree from "components/ArmyTree/ArmyTree";

interface ArmyCardProps {
    party: 'rovania' | 'brander'
}

const ArmyCard: React.FC<ArmyCardProps> = ({party}) => (
    <Card>
        <Card.Body>
            <ArmyTree party={party}/>
        </Card.Body>
    </Card>
);

export default ArmyCard;