import React, {useState} from "react";
import {FaMinus, FaPlus} from "react-icons/all";
import {Army, Unit} from "model/army";
import {Collapse, ListGroup} from "react-bootstrap";
import "./ArmyTree.scss";
import {connect} from "react-redux";
import {RootState} from "redux/rootReducer";
import {Battle} from "model/battle";
import {addUnitToBattle, removeUnitFromBattle} from "redux/slicers/battles";
import {RouteComponentProps, withRouter} from "react-router-dom";
import {isUnitInBattle} from "model/logic/battleLogic";

interface ArmyTreeProps {
    party: 'rovania' | 'brander'
}

interface ArmyTreeState {
    army: Army;
    battle: Battle;
}

interface ArmyTreeDispatched {
    addUnitToBattle: (unit: Unit) => void;
    removeUnitFromBattle: (unit: Unit) => void;
}

interface ArmyTreeNodeProps {
    unit: Unit;
    depth: number;

    battle: Battle;
    addUnitToBattle: (unit: Unit) => void;
    removeUnitFromBattle: (unit: Unit) => void;
}

const ArmyTreeNode: React.FC<ArmyTreeNodeProps> = ({unit, depth, ...otherProps}) => {
    const [isExpanded, setExpanded] = useState(false);
    const {battle, addUnitToBattle, removeUnitFromBattle} = otherProps;

    const toggleExpanded = (e: any) => {
        setExpanded(!isExpanded);
        e.stopPropagation();
    }

    const isActive = isUnitInBattle(battle, unit);
    const toggleSelection = () => isActive ? removeUnitFromBattle(unit) : addUnitToBattle(unit);

    return (
        <>
            <ListGroup.Item active={isActive} onClick={toggleSelection}>
                {[...new Array(depth)].map((_, i) => <span key={i} className="depth-filler"/>)}
                {'subunits' in unit ?
                    isExpanded ?
                        <FaMinus onClick={toggleExpanded}/>
                    :
                        <FaPlus onClick={toggleExpanded}/>

                :
                    <span className="expand-button-filler"/>
                }
                <strong className="ml-2">{unit.name}</strong> <em>{unit.commanderName}</em>
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
            <ArmyTreeNode key={index} unit={unit} depth={0} {...otherProps}/>
        )}
    </ListGroup>
);

export default withRouter(connect(
    (state: RootState, {party, match: {params}}: ArmyTreeProps & RouteComponentProps<{battleIndex: string}>) => ({
        army: state.armiesState.armies[party],
        battle: state.battles.battles[parseInt(params.battleIndex)] as Battle
    }),
    (dispatch, {match: {params: {battleIndex}}}) => ({
        addUnitToBattle: (unit: Unit) => dispatch<any>(addUnitToBattle({unit, battleIndex: parseInt(battleIndex)})),
        removeUnitFromBattle: (unit: Unit) => dispatch<any>(removeUnitFromBattle({unit, battleIndex: parseInt(battleIndex)}))
    })
)(ArmyTree));