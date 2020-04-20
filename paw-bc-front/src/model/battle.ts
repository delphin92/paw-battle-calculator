import {Unit, UnitPath, unitPathsEq, UnitType} from "model/army";

export interface Battle {
    id: number;
    place: string;

    battleConditions: BattleConditions;

    rovania: BattleParty;
    brander: BattleParty;
}

export interface BattleParty {
    allBattlingUnits: UnitPath[];

    [UnitType.infantry]: {
        tactic: InfantryTactic;
        units: BattlingUnit[];
        totalPower: number;
    }

    [UnitType.cavalry]: {
        tactic: CavalryTactic;
        units: BattlingUnit[];
        totalPower: number;
    }

    [UnitType.artillery]: {
        tactic: ArtilleryTactic;
        units: BattlingUnit[];
        totalPower: number;
    }
}

export interface BattlingUnit {
    path: UnitPath;
    power: number;
}

export enum InfantryTactic {
    skirmish = 'Перестрелка',
    firefight = 'Огневой бой',
    columnAttack = 'Атака колоннами',
    square = 'Каре'
}

export enum CavalryTactic {
    charge = 'Атака',
    flanking = 'Фланкировка',
    support = 'Поддержка'
}

export enum ArtilleryTactic {
    bombardment = 'Бомбардировка',
    artillerySuppression = 'Подавление артиллерии',
    support = 'Поддержка'
}

export type Tactic = InfantryTactic | CavalryTactic | ArtilleryTactic;

export interface BattleConditions {
    defenceBonus: number;
    formationPenalty: number;
    cavalryPenalty: number;
    artilleryFactor: number;
}

export const isUnitInBattle = (battle: Battle, unit: Unit) => {
    const party = unit.path[0] === 0 ? battle.rovania.allBattlingUnits : battle.brander.allBattlingUnits;
    const unitIndex = party.findIndex(path => unitPathsEq(path, unit.path));
    return unitIndex >= 0;
}