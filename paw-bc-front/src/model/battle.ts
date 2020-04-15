import {Unit, UnitPath, unitPathsEq} from "model/army";

export interface Battle {
    id: number;
    place: string;

    units: {
        rovania: UnitPath[];
        brander: UnitPath[];
    }
}

export const isUnitInBattle = (battle: Battle, unit: Unit) => {
    const party = unit.path[0] === 0 ? battle.units.rovania : battle.units.brander;
    const unitIndex = party.findIndex(path => unitPathsEq(path, unit.path));
    return unitIndex >= 0;
}