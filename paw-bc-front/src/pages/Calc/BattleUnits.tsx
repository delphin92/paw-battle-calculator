import React, {ChangeEvent} from "react";
import {BattlingUnit} from "model/battle";
import {Button, Form, FormControl, InputGroup} from "react-bootstrap";
import {Armies, getByPath, UnitLeaf, Unit} from "model/army";
import { flow } from "lodash";
import {RootState} from "redux/rootReducer";
import {changeUnitData, removeUnitFromBattle} from "redux/slicers/battles";
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
    changeUnitData: (unit: UnitLeaf, field: keyof BattlingUnit, value: any) => void;
    removeUnitFromBattle: (unit: Unit) => void;
}

const BattleUnits: React.FC<BattleUnitsProps & BattleUnitsState & BattleUnitsDispatched> = ({battlingUnits, armies, changeUnitData, removeUnitFromBattle}) => (
    <>
        <Form inline className="mb-3">
            {battlingUnits.map(flow(
                ({path, ...other}, index) => ({unit: getByPath(armies, path) as UnitLeaf, index, ...other}),
                ({unit, power, damageDistributionCoefficient, index}) =>
                    <InputGroup key={index} className="unit-power-input-group" size="sm">
                        <InputGroup.Prepend>
                            <InputGroup.Text>{unit.name}</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            type="number"
                            value={power}
                            onChange={({target: {value}}: ChangeEvent<HTMLInputElement>) =>
                                changeUnitData(unit, 'power', parseInt(value))
                            }
                        />
                        <FormControl
                            type="number"
                            value={damageDistributionCoefficient}
                            onChange={({target: {value}}: ChangeEvent<HTMLInputElement>) =>
                                changeUnitData(unit, 'damageDistributionCoefficient', parseInt(value))
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
        changeUnitData: (unit: UnitLeaf, field: keyof BattlingUnit, value: any) =>
            dispatch<any>(changeUnitData(parseInt(battleIndex), unit, field, value)),
        removeUnitFromBattle: (unit: Unit) => dispatch<any>(removeUnitFromBattle({unit, battleIndex: parseInt(battleIndex)}))
    })
)(BattleUnits));