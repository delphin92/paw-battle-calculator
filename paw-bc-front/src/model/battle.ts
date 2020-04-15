import {Unit, UnitPath, unitPathsEq} from "model/army";

export interface Battle {
    id: number;
    place: string;

    rovania: BattleParty;
    brander: BattleParty;
}

export interface BattleParty {
    tactic: BattleTactic;
    units: UnitPath[];
}

export enum BattleTactic {
    skirmish = 'Перестрелка',
    firefight = 'Огневой бой',
    columnAttack = 'Атака колоннами',
    square = 'Каре'
}

export const isUnitInBattle = (battle: Battle, unit: Unit) => {
    const party = unit.path[0] === 0 ? battle.rovania.units : battle.brander.units;
    const unitIndex = party.findIndex(path => unitPathsEq(path, unit.path));
    return unitIndex >= 0;
}