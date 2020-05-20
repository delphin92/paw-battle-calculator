import {BattleCharacteristics, UnitType} from "model/army";
import {ArtilleryTactic, CavalryTactic, InfantryTactic} from "model/battle";

const genericInfantryCharacteristics: BattleCharacteristics = {
    [InfantryTactic.skirmish]: {
        power:  8,
        pursuit: 2,
        disordering: 0,
        security: 10,
        calm: 10
    },
    [InfantryTactic.defend]: {
        power:  15,
        pursuit: 2,
        disordering: 0,
        security: 6,
        calm: 6
    },
    [InfantryTactic.lineOffence]: {
        power:  12,
        pursuit: 10,
        disordering: 5,
        security: 4,
        calm: 3
    }
}

const genericCavalryCharacteristics: BattleCharacteristics = {
    [CavalryTactic.support]: {
        power: 2,
        pursuit: 10,
        disordering: 2,
        security: 15,
        calm: 20
    },
    [CavalryTactic.flanking]: {
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
        security: 4,
        calm: 2
    }
}

const genericArtilleryCharacteristics: BattleCharacteristics = {
    [ArtilleryTactic.support]: {
        power: 10,
        pursuit: 0,
        disordering: 2,
        security: 20,
        calm: 20
    },
    [ArtilleryTactic.artillerySuppression]: {
        power: 5,
        pursuit: 0,
        disordering: 0,
        security: 50,
        calm: 50
    },
    [ArtilleryTactic.bombardment]: {
        power: 8,
        pursuit: 0,
        disordering: 0,
        security: 100,
        calm: 100
    }

}

export const genericCharacteristics = {
    [UnitType.infantry]: genericInfantryCharacteristics,
    [UnitType.cavalry]: genericCavalryCharacteristics,
    [UnitType.artillery]: genericArtilleryCharacteristics
}