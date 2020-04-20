import React, {ChangeEvent} from "react";
import {Card, Form} from "react-bootstrap";
import {RootState} from "redux/rootReducer";
import {connect} from "react-redux";
import {BattleConditions} from "model/battle";
import { changeBattleConditions } from "redux/slicers/battles";
import "pages/Calc/BattleConditionsCard.scss";

interface BattleConditionsCardProps {
    battleIndex: number;
}

interface BattleConditionsCardState {
    battleConditions: BattleConditions;
}

interface BattleConditionsCardDispatched {
    changeBattleConditions: (field: keyof BattleConditions, value: number) => void;
}

type AllProps = BattleConditionsCardProps & BattleConditionsCardState & BattleConditionsCardDispatched;

const BattleConditionsCard: React.FC<AllProps> = ({battleConditions, changeBattleConditions}) => {
    const changeField = (field: keyof BattleConditions) =>
        ({target: {value}}: ChangeEvent<HTMLInputElement>) =>
            changeBattleConditions(field, parseInt(value));

    return (
        <Card className="battle-conditions">
            <Card.Body>
                <Form inline>
                    <Form.Group controlId="defenceBonus">
                        <Form.Label>Бонус защиты</Form.Label>
                        <Form.Control type="number" size="sm"
                                      value={battleConditions.defenceBonus}
                                      onChange={changeField('defenceBonus')}/>
                    </Form.Group>

                    <Form.Group controlId="formationPenalty">
                        <Form.Label>Штраф построению</Form.Label>
                        <Form.Control type="number" size="sm"
                                      value={battleConditions.formationPenalty}
                                      onChange={changeField('formationPenalty')}/>
                    </Form.Group>

                    <Form.Group controlId="cavalryPenalty">
                        <Form.Label>Штраф кавалерии</Form.Label>
                        <Form.Control type="number" size="sm"
                                      value={battleConditions.cavalryPenalty}
                                      onChange={changeField('cavalryPenalty')}/>
                    </Form.Group>

                    <Form.Group controlId="artilleryFactor">
                        <Form.Label>Фактор артиллерии</Form.Label>
                        <Form.Control type="number" size="sm"
                                      value={battleConditions.artilleryFactor}
                                      onChange={changeField('artilleryFactor')}/>
                    </Form.Group>

                </Form>
            </Card.Body>
        </Card>
    );
};

export default connect(
    (state: RootState, {battleIndex}: BattleConditionsCardProps) => ({
        battleConditions: state.battles.battles[battleIndex].battleConditions
    }),
    (dispatch, {battleIndex}: BattleConditionsCardProps) => ({
        changeBattleConditions: (field: keyof BattleConditions, value: number) =>
            dispatch<any>(changeBattleConditions(battleIndex, field, value))
    })
)(BattleConditionsCard);