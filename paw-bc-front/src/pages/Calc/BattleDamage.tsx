import React from "react";
import {BattleParty} from "model/battle";
import {Armies, UnitType} from "model/army";
import {connect} from "react-redux";
import {RootState} from "redux/rootReducer";

interface BattleDamageProps {
    // battleIndex: number;
    battleParty: BattleParty;
    type: UnitType
}

interface BattleDamageState {
    armies: Armies;
}

const BattleDamage: React.FC<BattleDamageProps & BattleDamageState> = ({type, battleParty, armies}) => (
    <div>
        <div><strong>{type}</strong></div>

        {battleParty[type].units.map((unit, i) =>
            <div key={i}>
                {unit.takenDamage.manpowerDamage} {unit.takenDamage.moraleDamage}
            </div>
        )}
    </div>
);

export default connect(
    (state: RootState) => ({armies: state.armiesState.armies})
)(BattleDamage);