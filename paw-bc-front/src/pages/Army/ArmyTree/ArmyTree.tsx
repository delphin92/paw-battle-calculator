import React, {ChangeEvent, useState} from "react";
import {FaMinus, FaPlus} from "react-icons/all";
import {Army, Unit, UnitLeaf} from "model/army";
import {Collapse, Form, ListGroup} from "react-bootstrap";
import "./ArmyTree.scss";
import {connect} from "react-redux";
import {RootState} from "redux/rootReducer";
import {changeUnitData} from "redux/slicers/armiesState";

interface ArmyTreeProps {
    party: 'rovania' | 'brander'
}

interface ArmyTreeState {
    army: Army;
}

interface ArmyTreeDispatched {
    changeUnitData: (unit: UnitLeaf, field: keyof UnitLeaf, value: number) => void;
}

interface ArmyTreeNodeProps {
    unit: Unit;
    depth: number;
    isInitialExpanded?: boolean;
    changeUnitData: (unit: UnitLeaf, field: keyof UnitLeaf, value: number) => void;
}

const ArmyTreeNode: React.FC<ArmyTreeNodeProps> = ({unit, depth, isInitialExpanded=false, ...otherProps}) => {
    const [isExpanded, setExpanded] = useState(isInitialExpanded);
    const {changeUnitData} = otherProps;

    const toggleExpanded = (e: any) => {
        setExpanded(!isExpanded);
        e.stopPropagation();
    }

    const wrapId = (id: string) => unit.path.join('-') + '-' + id;

    return (
        <>
            <ListGroup.Item className="d-flex">
                {[...new Array(depth)].map((_, i) => <span key={i} className="depth-filler"/>)}
                {'subunits' in unit ?
                    isExpanded ?
                        <FaMinus onClick={toggleExpanded}/>
                    :
                        <FaPlus onClick={toggleExpanded}/>

                :
                    <span className="expand-button-filler"/>
                }
                <div className="ml-2">
                    <strong>{unit.name}</strong> <em>{unit.commanderName}</em>
                    {!('subunits' in unit) &&
                        <Form inline>
                            <Form.Group controlId={wrapId('manpower')}>
                                <Form.Label>Люди:</Form.Label>
                                <Form.Control
                                    className="ml-2"
                                    size="sm"
                                    type="number"
                                    value={unit.manpower}
                                    onChange={({target: {value}}: ChangeEvent<HTMLInputElement>) =>
                                        changeUnitData(unit, 'manpower', parseInt(value))
                                    }
                                />
                            </Form.Group>

                            <Form.Group controlId={wrapId('morale')} className="ml-3">
                                <Form.Label>Мораль:</Form.Label>
                                <Form.Control
                                    className="ml-2"
                                    size="sm"
                                    type="number"
                                    value={unit.morale}
                                    onChange={({target: {value}}: ChangeEvent<HTMLInputElement>) =>
                                        changeUnitData(unit, 'morale', parseInt(value))
                                    }
                                />
                            </Form.Group>
                        </Form>
                    }
                </div>
            </ListGroup.Item>
            {'subunits' in unit &&
                <Collapse in={isExpanded}>
                    <div>
                        {unit.subunits.map((unit, index) =>
                            <ArmyTreeNode key={index} unit={unit} depth={depth + 1} {...otherProps}/>
                        )}
                    </div>
                </Collapse>
            }
        </>
    );
}

const ArmyTree: React.FC<ArmyTreeProps & ArmyTreeState & ArmyTreeDispatched> = ({army, ...otherProps}) => (
    <ListGroup className="army-tree">
        {army.units.map((unit, index) =>
            <ArmyTreeNode key={index} unit={unit} depth={0} isInitialExpanded={true} {...otherProps}/>
        )}
    </ListGroup>
);

export default connect(
    (state: RootState, {party}: ArmyTreeProps) => ({
        army: state.armiesState.armies[party],
    }),
    { changeUnitData }
)(ArmyTree);