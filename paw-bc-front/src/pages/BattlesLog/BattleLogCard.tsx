import React from "react";
import {Battle} from "model/battle";
import {Party} from "model/army";
import {BattleSummaryCard} from "pages/Calc/BattleSummaryCard";
import {BattleDamageCard} from "pages/Calc/BattleDamageCard";
import {calculateResultRate} from "model/logic/battleLogic";

interface BattleLogCardProps {
    battle: Battle;
    party: Party;
}

const BattleLogCard: React.FC<BattleLogCardProps> = ({battle, party}) => (
    <div>
        <BattleSummaryCard battleParty={battle[party]}/>
        <BattleDamageCard battleParty={battle[party]} resultRate={calculateResultRate(battle, party)}/>
    </div>
);

export default BattleLogCard;