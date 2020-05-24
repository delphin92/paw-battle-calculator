import {Army, UnitType} from "model/army";
import {prepareUnits} from "data/army/utils";
import {InfantryTactic} from "model/battle";

const army: Army = {
    name: 'Армия Королевства Брандер',
    commanderName: 'Иоахим Фридрих Фон Кёниг',
    units: prepareUnits(1, [{
        name: 'Колонна Хагена',
        commanderName: 'Хаген',
        subunits: [{
            name: '1-я пехотная бригада',
            subunits: [{
                name: '13-й мушкетерский полк',
                type: UnitType.infantry,
                manpower: 2400,
                morale: 2600
            }]
        }]
    }])
};

export default army;