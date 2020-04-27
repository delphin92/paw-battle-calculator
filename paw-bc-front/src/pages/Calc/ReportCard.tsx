import React from "react";
import {Party} from "model/army";
import {BattleParty} from "model/battle";
import {Card, FormControl} from "react-bootstrap";
import {connect} from "react-redux";
import {RootState} from "redux/rootReducer";

interface ReportCardProps {
    battleIndex: number;
    party: Party;
}

interface ReportCardState {
    battleParty: BattleParty;
}

const ReportCard: React.FC<ReportCardProps & ReportCardState> = ({battleParty}) => (
    <Card>
        <Card.Body>
            <FormControl as="textarea" defaultValue={battleParty.report}/>
        </Card.Body>
    </Card>
);

export default connect(
    (state: RootState, ownProps: ReportCardProps) => ({
        battleParty: state.battles.battles[ownProps.battleIndex][ownProps.party]
    })
)(ReportCard);