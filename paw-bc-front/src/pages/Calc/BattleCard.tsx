import React from "react";
import {Card, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import {RouteComponentProps, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {RootState} from "redux/rootReducer";
import {ArtilleryTactic, Battle, BattleParty, CavalryTactic, InfantryTactic, Tactic} from "model/battle";
import {UnitType} from "model/army";
import {setBattleTactic} from "redux/slicers/battles";
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
}

const BattleCard: React.FC<BattleCardProps & BattleCardState & BattleCardDispatched> = ({battleParty, setBattleTactic}) => {
    const setInfantryTactic = (tactic: Tactic) => setBattleTactic(UnitType.infantry, tactic);
    const setCavalryTactic = (tactic: Tactic) => setBattleTactic(UnitType.cavalry, tactic);
    const setArtilleryTactic = (tactic: Tactic) => setBattleTactic(UnitType.artillery, tactic);

    return (
        <Card>
            <Card.Body>
                <ToggleButtonGroup type="radio" name="infantry-tactic" className="mb-2"
                                   value={battleParty[UnitType.infantry].tactic}
                                   onChange={setInfantryTactic}
                >
                    {Object.values(InfantryTactic).map((value, i) =>
                        <ToggleButton key={i} value={value}>{value}</ToggleButton>
                    )}
                </ToggleButtonGroup>

                <BattleUnits battlingUnits={battleParty[UnitType.infantry].units}/>

                <ToggleButtonGroup type="radio" name="cavalry-tactic" className="mb-2"
                                   value={battleParty[UnitType.cavalry].tactic}
                                   onChange={setCavalryTactic}
                >
                    {Object.values(CavalryTactic).map((value, i) =>
                        <ToggleButton key={i} value={value}>{value}</ToggleButton>
                    )}
                </ToggleButtonGroup>

                <BattleUnits battlingUnits={battleParty[UnitType.cavalry].units}/>

                <ToggleButtonGroup type="radio" name="artillery-tactic" className="mb-2"
                                   value={battleParty[UnitType.artillery].tactic}
                                   onChange={setArtilleryTactic}
                >
                    {Object.values(ArtilleryTactic).map((value, i) =>
                        <ToggleButton key={i} value={value}>{value}</ToggleButton>
                    )}
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
        setBattleTactic: (unitType: UnitType, tactic: Tactic) => dispatch<any>(setBattleTactic({unitType, tactic, party, battleIndex: parseInt(battleIndex)}))
    })
)(BattleCard));