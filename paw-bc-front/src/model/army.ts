export interface Army {
    name: string;

    units: Unit[];
}

export interface Armies {
    rovania: Army;
    brander: Army;
}

export const partyToIndex = {
    rovania: 0,
    brander: 1
}

export type UnitPath = number[];

export interface Unit {
    name: string;
    commanderName?: string;
        // sequence of indexes ordered from parent to child
    path: UnitPath;

    subunits?: Unit[];
}

export const getByPath = (armies: Armies, path: UnitPath): Unit => {
    const army = path[0] === 0 ? armies.rovania : armies.brander;

    let unit: Unit | undefined = army.units[path[1]];

    if (path.length > 2) {
        unit = unit.subunits?.[path[2]];
        if (path.length > 3) {
            unit = unit?.subunits?.[path[3]];
            if (path.length > 4) {
                unit = unit?.subunits?.[path[4]];
                if (path.length > 5) {
                    unit = unit?.subunits?.[path[5]];
                    if (path.length > 6) {
                        unit = unit?.subunits?.[path[6]];
                        if (path.length > 7) {
                            unit = unit?.subunits?.[path[7]];
                            if (path.length > 8) {
                                unit = unit?.subunits?.[path[8]];
                                if (path.length > 9) {
                                    unit = unit?.subunits?.[path[9]];
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    if (!unit) {
        throw new Error('Bad unit path');
    }

    return unit;
}

export const unitPathsEq = (path1: number[], path2: number[]): boolean =>
    path1.length === path2.length &&
    (path1.length === 0 || path1[0] === path2[0]) &&
    (path1.length === 1 || path1[1] === path2[1]) &&
    (path1.length === 2 || path1[2] === path2[2]) &&
    (path1.length === 3 || path1[3] === path2[3]) &&
    (path1.length === 4 || path1[4] === path2[4]) &&
    (path1.length === 5 || path1[5] === path2[5]) &&
    (path1.length === 6 || path1[6] === path2[6]) &&
    (path1.length === 7 || path1[7] === path2[7]) &&
    (path1.length === 8 || path1[8] === path2[8]) &&
    (path1.length === 9 || path1[9] === path2[9]);