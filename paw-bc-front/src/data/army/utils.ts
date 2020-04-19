import {Unit, UnitLeaf, UnitNode, UnitPath} from "model/army";

type RawUnit = (Omit<Omit<UnitNode, 'path'>, 'subunits'> & {
    subunits?: RawUnit[]
}) | Omit<UnitLeaf, 'path'>;

const setPath = (unit: RawUnit, path: UnitPath): Unit => ({
    ...unit,
    path,
    ...(
        'subunits' in unit && unit.subunits ? {
            subunits: unit.subunits.map((u, i) =>
                setPath(u, [...path, i] as UnitPath)
            )
        }:{}
    )

}) as Unit;

export const prepareUnits = (party: number, units: RawUnit[]): Unit[] =>
    units.map((unit, i)  => setPath(unit, [party, i]))