import React, {useState} from "react";
import {FaMinus, FaPlus} from "react-icons/all";
import {Army, Unit} from "model/army";
import {Collapse, ListGroup} from "react-bootstrap";
import "./ArmyTree.scss";

interface ArmyTreeProps {
    army: Army;
}

interface ArmyTreeNodeProps {
    unit: Unit;
    depth: number;
}

const ArmyTreeNode: React.FC<ArmyTreeNodeProps> = ({unit, depth}) => {
    const [isExpanded, setExpanded] = useState(false);

    return (
        <>
            <ListGroup.Item>
                {[...new Array(depth)].map(() => <span className="depth-filler"/>)}
                {unit.subunits ?
                    isExpanded ?
                        <FaMinus onClick={() => setExpanded(false)}/>
                    :
                        <FaPlus onClick={() => setExpanded(true)}/>

                :
                    <span className="expand-button-filler"/>
                }
                <strong className="ml-2">{unit.name}</strong> <em>{unit.commanderName}</em>
            </ListGroup.Item>
            {unit.subunits &&
                <Collapse in={isExpanded}>
                    <div>
                        {unit.subunits.map((unit, index) =>
                            <ArmyTreeNode key={index} unit={unit} depth={depth + 1}/>
                        )}
                    </div>
                </Collapse>
            }
        </>
    );
}

const ArmyTree: React.FC<ArmyTreeProps> = ({army}) => (
    <ListGroup className="army-tree">
        {army.units.map((unit, index) =>
            <ArmyTreeNode key={index} unit={unit} depth={0}/>
        )}
    </ListGroup>
);

export default ArmyTree;