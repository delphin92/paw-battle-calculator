import {BattleCharacteristics, UnitType} from "model/army";
import {ArtilleryTactic, CavalryTactic, InfantryTactic} from "model/battle";

const genericInfantryCharacteristics: BattleCharacteristics = {
    [InfantryTactic.probe]: {
        power:  8,
        pursuit: 2,
        disordering: 0,
        security: 5,
        calm: 10
    },
    [InfantryTactic.defend]: {
        power:  10,
        pursuit: 5,
        disordering: 0,
        security: 2,
        calm: 2
    },
    [InfantryTactic.offence]: {
        power:  9,
        pursuit: 10,
        disordering: 5,
        security: 1,
        calm: 1
    },
    [InfantryTactic.attack]: {
        power:  8,
        pursuit: 20,
        disordering: 10,
        security: 0.5,
        calm: 0.5
    }
}

const genericCavalryCharacteristics: BattleCharacteristics = {
    [CavalryTactic.support]: {
        power: 2,
        pursuit: 10,
        disordering: 2,
        security: 4,
        calm: 4
    },
    [CavalryTactic.probe]: {
        power: 6,
        pursuit: 8,
        disordering: 0,
        security: 10,
        calm: 12
    },
    [CavalryTactic.charge]: {
        power: 10,
        pursuit: 20,
        disordering: 10,
        security: 0.2,
        calm: 0.2
    }
}

const genericArtilleryCharacteristics: BattleCharacteristics = {
    [ArtilleryTactic.support]: {
        power: 40,
        pursuit: 0,
        disordering: 2,
        security: 8,
        calm: 8
    },
    [ArtilleryTactic.artillerySuppression]: {
        power: 18,
        pursuit: 0,
        disordering: 0,
        security: 16,
        calm: 16
    },
    [ArtilleryTactic.bombardment]: {
        power: 20,
        pursuit: 0,
        disordering: 0,
        security: 32,
        calm: 32
    }

}

export const genericCharacteristics = {
    [UnitType.infantry]: genericInfantryCharacteristics,
    [UnitType.cavalry]: genericCavalryCharacteristics,
    [UnitType.artillery]: genericArtilleryCharacteristics
}