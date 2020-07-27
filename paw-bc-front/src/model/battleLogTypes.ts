import {Battle} from "model/battle";

export type BattlesLog = {
    [key: number]: BattleLog;
};

export type BattleLog = Battle[];