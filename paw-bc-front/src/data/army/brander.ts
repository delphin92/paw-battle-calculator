import {Army, UnitType} from "model/army";
import {prepareUnits} from "data/army/utils";
import {InfantryTactic} from "model/battle";

const army: Army = {
    name: 'Армия Королевства Брандер',
    units: prepareUnits(1, [{
        name: 'Колонна Хагена',
        commanderName: 'Хаген',
        subunits: [{
            name: '1-я пехотная бригада',
            subunits: [{
                name: '13-й мушкетерский полк',
                type: UnitType.infantry,
                power: {
                    [InfantryTactic.firefight]: 33
                },
                defence: {
                    [InfantryTactic.firefight]: 6
                },
                manpower: 2400,
                morale: 2600
            }]
        }]
    }])
};

export default army;