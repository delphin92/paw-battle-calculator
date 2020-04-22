import React, {ChangeEvent} from "react";
import {BattlingUnit} from "model/battle";
import {Button, Form, FormControl, InputGroup} from "react-bootstrap";
import {Armies, getByPath, UnitLeaf, Unit} from "model/army";
import { flow } from "lodash";
import {RootState} from "redux/rootReducer";
import {changeUnitPower, removeUnitFromBattle} from "redux/slicers/battles";
import {connect} from "react-redux";
import { FaTimes } from "react-icons/fa";
import {RouteComponentProps, withRouter} from "react-router-dom";
import './BattleUnits.scss';

interface BattleUnitsProps {
    battlingUnits: BattlingUnit[]
}

interface BattleUnitsState {
    armies: Armies;
}

interface BattleUnitsDispatched {
    changeUnitPower: (unit: UnitLeaf, power: number) => void;
    removeUnitFromBattle: (unit: Unit) => void;
}

const BattleUnits: React.FC<BattleUnitsProps & BattleUnitsState & BattleUnitsDispatched> = ({battlingUnits, armies, changeUnitPower, removeUnitFromBattle}) => (
    <>
        <Form inline className="mb-3">
            {battlingUnits.map(flow(
                ({path, power}, index) => ({unit: getByPath(armies, path) as UnitLeaf, power, index}),
                ({unit, power, index}) =>
                    <InputGroup key={index} className="unit-power-input-group" size="sm">
                        <InputGroup.Prepend>
                            <InputGroup.Text>{unit.name}</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            type="number"
                            value={power}
                            onChange={({target: {value}}: ChangeEvent<HTMLInputElement>) =>
                                changeUnitPower(unit, parseInt(value))
                            }
                        />
                        <InputGroup.Append>
                            <Button variant="outline-secondary"
                                    onClick={() => removeUnitFromBattle(unit)}
                            >
                                <FaTimes/>
                            </Button>
                        </InputGroup.Append>
                    </InputGroup>
            ))}
        </Form>
    </>
);

export default withRouter(connect(
    (state: RootState) => ({
        armies: state.armiesState.armies
    }),
    (dispatch, {match: {params: {battleIndex}}}: RouteComponentProps<{battleIndex: string}>) => ({
        changeUnitPower: (unit: UnitLeaf, power: number) =>
            dispatch(changeUnitPower({battleIndex: parseInt(battleIndex), unit, power})),
        removeUnitFromBattle: (unit: Unit) => dispatch<any>(removeUnitFromBattle({unit, battleIndex: parseInt(battleIndex)}))
    })
)(BattleUnits));