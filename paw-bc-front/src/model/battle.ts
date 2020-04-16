import {Unit, UnitPath, unitPathsEq, UnitType} from "model/army";

export interface Battle {
    id: number;
    place: string;

    rovania: BattleParty;
    brander: BattleParty;
}

export interface BattleParty {
    allBattlingUnits: UnitPath[];

    [UnitType.infantry]: {
        tactic: InfantryTactic;
        units: UnitPath[];
        totalPower: number;
    }

    [UnitType.cavalry]: {
        tactic: CavalryTactic;
        units: UnitPath[];
        totalPower: number;
    }

    [UnitType.artillery]: {
        tactic: ArtilleryTactic;
        units: UnitPath[];
        totalPower: number;
    }
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

export const isUnitInBattle = (battle: Battle, unit: Unit) => {
    const party = unit.path[0] === 0 ? battle.rovania.allBattlingUnits : battle.brander.allBattlingUnits;
    const unitIndex = party.findIndex(path => unitPathsEq(path, unit.path));
    return unitIndex >= 0;
}