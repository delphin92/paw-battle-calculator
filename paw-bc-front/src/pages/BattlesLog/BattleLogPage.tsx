import React from "react";
import {Accordion, Card, Nav} from "react-bootstrap";
import {Link, RouteComponentProps} from "react-router-dom";
import {connect} from "react-redux";
import {RootState} from "redux/rootReducer";
import {BattleLogState} from "redux/slicers/battlesLog";
import BattleLogItem from "pages/BattlesLog/BattleLogItem";
import { values } from "lodash";

interface BattleLogPageProps {
}

const BattleLogPage: React.FC<BattleLogPageProps & BattleLogState & RouteComponentProps<{battleIndex: string}>> =
        ({battlesLog, match: {params: {battleIndex}}}) => {
    const currentBattleLog = battlesLog[parseInt(battleIndex)]

    return (
        <>
            <Nav variant="tabs" activeKey={battleIndex}>
                {values(battlesLog).map((battleLog, index) =>
                    <Nav.Item key={index}>
                        <Nav.Link as={Link} to={'/log/' + index} eventKey={index}>{battleLog[0].place}</Nav.Link>
                    </Nav.Item>
                )}
            </Nav>

            <Accordion>

                {currentBattleLog && currentBattleLog.map((battle, i) =>
                    <Card>
                        <Accordion.Toggle as={Card.Header} variant="link" eventKey={i.toString()}>
                            Эпизод {i}
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey={i.toString()}>
                            <Card.Body>
                                <BattleLogItem key={i} battle={battle}/>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                )}
            </Accordion>
        </>
    );
};

export default connect((state: RootState) => state.battlesLog)(BattleLogPage);