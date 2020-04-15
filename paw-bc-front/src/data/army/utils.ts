import {Unit, UnitPath} from "model/army";

type RawUnit = Omit<Omit<Unit, 'path'>, 'subunits'> & {
    subunits?: RawUnit[]
}

const setPath = (unit: RawUnit, path: UnitPath): Unit => ({
    ...unit,
    path,
    subunits: unit.subunits && unit.subunits.map((u, i) =>
        setPath(u, [...path, i] as UnitPath)
    )
});

export const prepareUnits = (party: number, units: RawUnit[]): Unit[] =>
    units.map((unit, i)  => setPath(unit, [party, i]))