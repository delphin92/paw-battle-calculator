import React from "react";
import {Card} from "react-bootstrap";
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
            <p><strong>Сила пехоты:</strong> {battleSummary.infantryPower}</p>
            <p><strong>Сила кавалерии:</strong> {battleSummary.cavalryPower}</p>
            <p><strong>Сила артиллерии:</strong> {battleSummary.artilleryPower}</p>
            {/*<p><strong>Бонус поддержки кавалерии:</strong> {battleSummary.cavalrySupportBonus}</p>*/}
            {/*<p><strong>Бонус поддержки артиллерии:</strong> {battleSummary.artillerySupportBonus}</p>*/}
            <p><strong>Общаая сила:</strong> {battleSummary.totalPower}</p>
            <p><strong>Общее преследование:</strong> {battleSummary.totalPursuit}</p>
        </Card.Body>
    </Card>
);

export default connect(
    (state: RootState, {battleIndex, party}: BattleSummaryCardProps) => ({
        battleSummary: state.battles.battles[battleIndex][party].battleSummary
    }))
(BattleSummaryCard);