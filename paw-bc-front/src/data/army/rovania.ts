import {Army, UnitType} from "model/army";
import {prepareUnits} from "data/army/utils";
import {ArtilleryTactic, CavalryTactic, InfantryTactic} from "model/battle";

const army: Army = {
    name: 'Армия Рованской Республики',
    units: prepareUnits(0, [{
        name: '1-й пехотный корпус',
        commanderName: 'Жозес де Вон',
        subunits: [{
            name: '1-я пехотная дивизия',
            subunits: [{
                name: '1-я пехотная бригада',
                subunits: [{
                    name: '32 линейный полк',
                    type: UnitType.infantry,
                    power: {
                        [InfantryTactic.skirmish]: 8,
                        [InfantryTactic.firefight]: 20,
                        [InfantryTactic.columnAttack]: 35
                    },
                    defence: {
                        [InfantryTactic.skirmish]: 10,
                        [InfantryTactic.firefight]: 5,
                        [InfantryTactic.columnAttack]: 2
                    },
                    manpower: 1400,
                    morale: 1400
                }, {
                    name: '23 легкий полк',
                    type: UnitType.infantry,
                    power: {
                        [InfantryTactic.skirmish]: 9,
                        [InfantryTactic.firefight]: 19,
                        [InfantryTactic.columnAttack]: 33
                    },
                    defence: {
                        [InfantryTactic.skirmish]: 12,
                        [InfantryTactic.firefight]: 4,
                        [InfantryTactic.columnAttack]: 2
                    },
                    manpower: 1400,
                    morale: 1200
                }]
            }, {
                name: '2-я пехотная бригада',
                subunits: [{
                    name: '16 линейный полк'
                }, {
                    name: '43 линейный полк'
                }]
            }]
        }, {
            name: '2-я пехотная дивизия'
        }, {
            name: '3-я пехотная дивизия'
        }, {
            name: 'Кавалерийская дивизия',
            subunits: [{
                name: '1-я бригада',
                subunits: [{
                    name: '8-й гусарский полк',
                    type: UnitType.cavalry,
                    power: {
                        [CavalryTactic.support]: 15,
                        [CavalryTactic.charge]: 8,
                        [CavalryTactic.flanking]: 6
                    },
                    manpower: 1200,
                    morale: 1200
                }, {
                    name: '11-й конноегерской полк',
                    type: UnitType.cavalry,
                    power: {
                        [CavalryTactic.support]: 16,
                        [CavalryTactic.charge]: 7,
                        [CavalryTactic.flanking]: 5
                    },
                    manpower: 1200,
                    morale: 1300
                }]
            }]
        }, {
            name: 'Артиллерийская бригада',
            subunits: [{
                name: '1-я батарея',
                type: UnitType.artillery,
                power: {
                    [ArtilleryTactic.support]: 100,
                    [ArtilleryTactic.bombardment]: 150,
                    [ArtilleryTactic.artillerySuppression]: 130
                },
                manpower: 100,
                morale: 100
            }, {
                name: '2-я батарея',
                type: UnitType.artillery,
                power: {
                    [ArtilleryTactic.support]: 110,
                    [ArtilleryTactic.bombardment]: 140,
                    [ArtilleryTactic.artillerySuppression]: 120
                },
                manpower: 100,
                morale: 100
            }]
        }]
    }, {
        name: '2-й пехотный корпус',
        commanderName: 'Антуа Морди',
    }, {
        name: '1-й кавалерийский корпус',
        commanderName: 'Жан Койтон',
    }])
};

export default army;