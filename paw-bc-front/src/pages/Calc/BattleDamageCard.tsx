import React from "react";
import {Card} from "react-bootstrap";
import {Party, UnitType} from "model/army";
import {BattleParty} from "model/battle";
import {connect} from "react-redux";
import {RootState} from "redux/rootReducer";
import BattleDamage from "pages/Calc/BattleDamage";

interface BattleDamageCardProps {
    battleIndex: number;
    party: Party;
}

interface BattleDamageCardState {
    battleParty: BattleParty;
}

const BattleDamageCard: React.FC<BattleDamageCardProps & BattleDamageCardState> = ({battleParty}) => (
    <Card>
        <Card.Body>
            <BattleDamage type={UnitType.infantry} battleParty={battleParty}/>
            <BattleDamage type={UnitType.cavalry} battleParty={battleParty}/>
            <BattleDamage type={UnitType.artillery} battleParty={battleParty}/>
        </Card.Body>
    </Card>
);

export default connect(
    (state: RootState, ownProps: BattleDamageCardProps) => ({
        battleParty: state.battles.battles[ownProps.battleIndex][ownProps.party]
    })
)(BattleDamageCard);