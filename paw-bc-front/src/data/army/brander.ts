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
                battleCharacteristics: {
                    [InfantryTactic.skirmish]: {
                        power:  2,
                        pursuit: 0,
                        disordering: 1,
                        security: 8,
                        calm: 8
                    },
                    [InfantryTactic.defend]: {
                        power:  20,
                        pursuit: 0,
                        disordering: 0,
                        security: 6,
                        calm: 8
                    },
                    [InfantryTactic.lineOffence]: {
                        power:  15,
                        pursuit: 8,
                        disordering: 3,
                        security: 4,
                        calm: 4
                    }
                },
                manpower: 2400,
                morale: 2600
            }]
        }]
    }])
};

export default army;