import {BattleCharacteristic, UnitPath, UnitType} from "model/army";

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
    report: string;

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
    battleCharacteristic: BattleCharacteristic;
    damageDistributionCoefficient: number;
    takenDamage: Damage;
}

export enum InfantryTactic {
    probe = 'Разведка',
    defend = 'Оборона',
    offence = 'Наступление',
    attack = 'Атака'
}

export enum CavalryTactic {
    charge = 'Атака',
    probe = 'Разведка',
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

    infantryPursuit: number;
    cavalryPursuit: number;

    totalPower: number;
    totalPursuit: number;
}

interface BattlePartyUnitsData<Data> {
    [UnitType.infantry]: Data[];
    [UnitType.cavalry]: Data[];
    [UnitType.artillery]: Data[];
}

export type BattlePartyUnitsCharacteristic = BattlePartyUnitsData<BattleCharacteristic>;

export interface Damage {
    manpowerDamage: number;
    moraleDamage: number;
    disorder: number;
}

export interface UnitDamage extends Damage {
    unit: UnitPath;
}

export type BattlePartyUnitsDamage = BattlePartyUnitsData<UnitDamage>;