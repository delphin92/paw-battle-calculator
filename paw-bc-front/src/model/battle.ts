import {UnitPath, UnitType} from "model/army";

export interface Battle {
    id: number;
    place: string;

    battleConditions: BattleConditions;

    rovania: BattleParty;
    brander: BattleParty;
}

export interface BattleParty {
    allBattlingUnits: UnitPath[];
    battleSummary: BattleSummary;

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
    takenDamage: Damage;
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

export interface BattleSummary {
    infantryPower: number;
    cavalryPower: number;
    artilleryPower: number;

    cavalrySupportBonus: number;
    artillerySupportBonus: number;
    totalPower: number;
}

// export interface BattleResult {
//     manpowerDamage: number;
//     moraleDamage: number;
// }

export interface Damage {
    manpowerDamage: number;
    moraleDamage: number;
}

export interface UnitDamage extends Damage {
    unit: UnitPath;
}

export interface BattlePartyDamage {
    [UnitType.infantry]: UnitDamage[];
    [UnitType.cavalry]: UnitDamage[];
    [UnitType.artillery]: UnitDamage[];
}