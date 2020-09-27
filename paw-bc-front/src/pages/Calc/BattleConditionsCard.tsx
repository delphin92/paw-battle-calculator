import React, {ChangeEvent} from "react";
import {Card, Col, Form, Row} from "react-bootstrap";
import {RootState} from "redux/rootReducer";
import {connect} from "react-redux";
import {PartyBattleConditions} from "model/battle";
import { changeBattleConditions } from "redux/slicers/battles";
import "pages/Calc/BattleConditionsCard.scss";
import {Party} from "model/army";

interface BattleConditionsCardProps {
    battleIndex: number;
    party: Party;
}

interface BattleConditionsCardState {
    battleConditions: PartyBattleConditions;
}

interface BattleConditionsCardDispatched {
    changeBattleConditions: (field: keyof PartyBattleConditions, value: number) => void;
}

type AllProps = BattleConditionsCardProps & BattleConditionsCardState & BattleConditionsCardDispatched;

const LABEL_COL_SIZE = 8;
const INPUT_COL_SIZE = 4;

const BattleConditionsCard: React.FC<AllProps> = ({battleConditions, changeBattleConditions, party}) => {
    const changeField = (field: keyof PartyBattleConditions) =>
        ({target: {value}}: ChangeEvent<HTMLInputElement>) =>
            changeBattleConditions(field, parseInt(value));

    const wrapId = (id: string) => `${party}-${id}`;

    return (
        <Card className="battle-conditions">
            <Card.Body>
                <Form>
                    <Row>
                        <Col lg={6}>
                            <Form.Group as={Row} controlId={wrapId('defenceBonus')}>
                                <Form.Label column="sm" sm={LABEL_COL_SIZE}>Бонус защиты</Form.Label>
                                <Col sm={INPUT_COL_SIZE}>
                                    <Form.Control type="number" size="sm"
                                                  value={battleConditions.defenceBonus}
                                                  onChange={changeField('defenceBonus')}/>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId={wrapId('artilleryFactor')}>
                                <Form.Label column="sm" sm={LABEL_COL_SIZE}>Фактор артиллерии</Form.Label>
                                <Col sm={INPUT_COL_SIZE}>
                                    <Form.Control type="number" size="sm"
                                                  value={battleConditions.artilleryFactor}
                                                  onChange={changeField('artilleryFactor')}/>
                                </Col>
                            </Form.Group>
                        </Col>
                        <Col lg={6}>
                            <Form.Group as={Row} controlId={wrapId('formationPenalty')}>
                                <Form.Label column="sm" sm={LABEL_COL_SIZE}>Штраф построению</Form.Label>
                                <Col sm={INPUT_COL_SIZE}>
                                    <Form.Control type="number" size="sm"
                                                  value={battleConditions.formationPenalty}
                                                  onChange={changeField('formationPenalty')}/>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId={wrapId('cavalryPenalty')}>
                                <Form.Label column="sm" sm={LABEL_COL_SIZE}>Штраф кавалерии</Form.Label>
                                <Col sm={INPUT_COL_SIZE}>
                                    <Form.Control type="number" size="sm"
                                                  value={battleConditions.cavalryPenalty}
                                                  onChange={changeField('cavalryPenalty')}/>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default connect(
    (state: RootState, {battleIndex, party}: BattleConditionsCardProps) => ({
        battleConditions: state.battles.battles[battleIndex].battleConditions[party]
    }),
    (dispatch, {battleIndex, party}: BattleConditionsCardProps) => ({
        changeBattleConditions: (field: keyof PartyBattleConditions, value: number) =>
            dispatch<any>(changeBattleConditions(battleIndex, party, field, value))
    })
)(BattleConditionsCard);