import {BattleCharacteristic, BattleCharacteristics, Unit, UnitLeaf, UnitNode, UnitPath} from "model/army";
import {genericCharacteristics} from "model/instances/armyInstances";
import { mapValues } from "lodash";

type RawUnit = (Omit<Omit<UnitNode, 'path'>, 'subunits'> & {
    subunits?: RawUnit[]
}) | Omit<UnitLeaf, 'path'>;

const mergeBattleCharacteristics = (unit: UnitLeaf): BattleCharacteristics => {
    const genericUnitCharacteristics = genericCharacteristics[unit.type];

    return mapValues(genericUnitCharacteristics, (characteristics, tactic: keyof BattleCharacteristics) => ({
        ...mapValues(characteristics, (value, field: keyof BattleCharacteristic) =>
            value + (unit.battleCharacteristics?.[tactic]?.[field] ?? 0)
        )
    }))
}

const setPath = (unit: RawUnit, path: UnitPath): Unit => ({
    ...unit,
    path,
    ...(
        'subunits' in unit && unit.subunits ? {
            subunits: unit.subunits.map((u, i) =>
                setPath(u, [...path, i] as UnitPath)
            )
        }:{
            battleCharacteristics: mergeBattleCharacteristics(unit as UnitLeaf)
        }
    )

}) as Unit;

export const prepareUnits = (party: number, units: RawUnit[]): Unit[] =>
    units.map((unit, i)  => setPath(unit, [party, i]))