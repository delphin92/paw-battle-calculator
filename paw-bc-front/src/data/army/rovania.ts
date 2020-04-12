import {Army} from "model/army";

const army: Army = {
    name: 'Армия Рованской Республики',
    units: [{
        name: '1-й пехотный корпус',
        commanderName: 'Жозес де Вон',
        subunits: [{
            name: '1-я пехотная дивизия',
            subunits: [{
                name: '1-я пехотная бригада',
                subunits: [{
                    name: '32 линейный полк'
                }, {
                    name: '23 легкий полк'
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
            name: 'Кавалерийская дивизия'
        }, {
            name: 'Артиллерийская бригада'
        }]
    }, {
        name: '2-й пехотный корпус',
        commanderName: 'Антуа Морди',
    }, {
        name: '1-й кавалерийский корпус',
        commanderName: 'Жан Койтон',
    }]
};

export default army;