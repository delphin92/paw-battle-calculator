import React from "react";
import {Card, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import {RouteComponentProps, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {RootState} from "redux/rootReducer";
import {ArtilleryTactic, Battle, BattleParty, CavalryTactic, InfantryTactic, Tactic} from "model/battle";
import {UnitNode, UnitType} from "model/army";
import {removeUnitFromBattle, setBattleTactic} from "redux/slicers/battles";
import BattleUnits from "pages/Calc/BattleUnits";

interface BattleCardProps {
    party: 'rovania' | 'brander';
}

interface BattleCardState {
    battle: Battle;
    battleParty: BattleParty;
}

interface BattleCardDispatched {
    setBattleTactic: (unitType: UnitType, tactic: Tactic) => void;
    removeUnitFromBattle: (unit: UnitNode) => void;
}

const BattleCard: React.FC<BattleCardProps & BattleCardState & BattleCardDispatched> = ({battleParty, setBattleTactic}) => {
    const setInfantryTactic = (tactic: Tactic) => setBattleTactic(UnitType.infantry, tactic);
    const setCavalryTactic = (tactic: Tactic) => setBattleTactic(UnitType.cavalry, tactic);
    const setArtilleryTactic = (tactic: Tactic) => setBattleTactic(UnitType.artillery, tactic);

    return (
        <Card>
            <Card.Body>
                <ToggleButtonGroup type="radio" name="infantry-tactic"
                                   value={battleParty[UnitType.infantry].tactic}
                                   onChange={setInfantryTactic}
                >
                    <ToggleButton value={InfantryTactic.skirmish}>{InfantryTactic.skirmish}</ToggleButton>
                    <ToggleButton value={InfantryTactic.firefight}>{InfantryTactic.firefight}</ToggleButton>
                    <ToggleButton value={InfantryTactic.columnAttack}>{InfantryTactic.columnAttack}</ToggleButton>
                    <ToggleButton value={InfantryTactic.square}>{InfantryTactic.square}</ToggleButton>
                </ToggleButtonGroup>

                <BattleUnits battlingUnits={battleParty[UnitType.infantry].units}/>

                <ToggleButtonGroup type="radio" name="infantry-tactic"
                                   value={battleParty[UnitType.cavalry].tactic}
                                   onChange={setCavalryTactic}
                >
                    <ToggleButton value={CavalryTactic.support}>{CavalryTactic.support}</ToggleButton>
                    <ToggleButton value={CavalryTactic.charge}>{CavalryTactic.charge}</ToggleButton>
                    <ToggleButton value={CavalryTactic.flanking}>{CavalryTactic.flanking}</ToggleButton>
                </ToggleButtonGroup>

                <BattleUnits battlingUnits={battleParty[UnitType.cavalry].units}/>

                <ToggleButtonGroup type="radio" name="infantry-tactic"
                                   value={battleParty[UnitType.artillery].tactic}
                                   onChange={setArtilleryTactic}
                >
                    <ToggleButton value={ArtilleryTactic.support}>{ArtilleryTactic.support}</ToggleButton>
                    <ToggleButton value={ArtilleryTactic.bombardment}>{ArtilleryTactic.bombardment}</ToggleButton>
                    <ToggleButton value={ArtilleryTactic.artillerySuppression}>{ArtilleryTactic.artillerySuppression}</ToggleButton>
                </ToggleButtonGroup>

                <BattleUnits battlingUnits={battleParty[UnitType.artillery].units}/>
            </Card.Body>
        </Card>
    );
};

export default withRouter(connect(
    (state: RootState, {party, match: {params}}: BattleCardProps & RouteComponentProps<{battleIndex: string}>) => ({
        battle: state.battles.battles[parseInt(params.battleIndex)],
        battleParty: state.battles.battles[parseInt(params.battleIndex)][party]
    }),
    (dispatch, {party, match: {params: {battleIndex}}}) => ({
        setBattleTactic: (unitType: UnitType, tactic: Tactic) => dispatch<any>(setBattleTactic({unitType, tactic, party, battleIndex: parseInt(battleIndex)})),
        removeUnitFromBattle: (unit: UnitNode) => dispatch(removeUnitFromBattle({unit, battleIndex: parseInt(battleIndex)}))
    })
)(BattleCard));