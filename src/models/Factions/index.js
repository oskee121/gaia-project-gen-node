import uniqueRandomArray from 'unique-random-array';
import UniqueRandomArray from 'src/utils/UniqueRandomArray';
import {
    PLANET_TYPE_EARTH,
    PLANET_TYPE_RED,
    PLANET_TYPE_ORANGE,
    PLANET_TYPE_YELLOW,
    PLANET_TYPE_BROWN,
    PLANET_TYPE_BLACK,
    PLANET_TYPE_WHITE,
} from 'src/models/Planet';
import {ifNil} from 'src/utils/ifNull';

export const FACTION_EARTH_TERRANS = 'FACTION/EARTH/TERRANS';
export const FACTION_EARTH_LANTIDS = 'FACTION/EARTH/LANTIDS';
export const FACTION_YELLOW_XENOS = 'FACTION/YELLOW/XENOS';
export const FACTION_YELLOW_GLEENS = 'FACTION/YELLOW/GLEENS';
export const FACTION_BROWN_TAKLONS = 'FACTION/BROWN/TAKLONS';
export const FACTION_BROWN_AMBAS = 'FACTION/BROWN/AMBAS';
export const FACTION_RED_HADSCH_HALLAS = 'FACTION/RED/HADSCH_HALLAS';
export const FACTION_RED_IVITS = 'FACTION/RED/IVITS';
export const FACTION_ORANGE_GEODENS = 'FACTION/ORANGE/GEODENS';
export const FACTION_ORANGE_BAL_TAKS = 'FACTION/ORANGE/BAL_TAKS';
export const FACTION_BLACK_FIRAKS = 'FACTION/BLACK/FIRAKS';
export const FACTION_BLACK_BESCODS = 'FACTION/BLACK/BESCODS';
export const FACTION_WHITE_NEVLAS = 'FACTION/WHITE/NEVLAS';
export const FACTION_WHITE_ITARS = 'FACTION/WHITE/ITARS';


class Factions {
    #factions;
    constructor() {
        this.#factions = {
            [FACTION_EARTH_TERRANS]: { code: FACTION_EARTH_TERRANS, planet: PLANET_TYPE_EARTH, image: 'FACterrans' },
            [FACTION_EARTH_LANTIDS]: { code: FACTION_EARTH_LANTIDS, planet: PLANET_TYPE_EARTH, image: 'FAClantids' },
            [FACTION_YELLOW_XENOS]: { code: FACTION_YELLOW_XENOS, planet: PLANET_TYPE_YELLOW, image: 'FACxenos' },
            [FACTION_YELLOW_GLEENS]: { code: FACTION_YELLOW_GLEENS, planet: PLANET_TYPE_YELLOW, image: 'FACgleens' },
            [FACTION_BROWN_TAKLONS]: { code: FACTION_BROWN_TAKLONS, planet: PLANET_TYPE_BROWN, image: 'FACtaklons' },
            [FACTION_BROWN_AMBAS]: { code: FACTION_BROWN_AMBAS, planet: PLANET_TYPE_BROWN, image: 'FACambas' },
            [FACTION_RED_HADSCH_HALLAS]: { code: FACTION_RED_HADSCH_HALLAS, planet: PLANET_TYPE_RED, image: 'FAChhallas' },
            [FACTION_RED_IVITS]: { code: FACTION_RED_IVITS, planet: PLANET_TYPE_RED, image: 'FACivits' },
            [FACTION_ORANGE_GEODENS]: { code: FACTION_ORANGE_GEODENS, planet: PLANET_TYPE_ORANGE, image: 'FACgeodens' },
            [FACTION_ORANGE_BAL_TAKS]: { code: FACTION_ORANGE_BAL_TAKS, planet: PLANET_TYPE_ORANGE, image: 'FACbaltaks' },
            [FACTION_BLACK_FIRAKS]: { code: FACTION_BLACK_FIRAKS, planet: PLANET_TYPE_BLACK, image: 'FACfiraks' },
            [FACTION_BLACK_BESCODS]: { code: FACTION_BLACK_BESCODS, planet: PLANET_TYPE_BLACK, image: 'FACbescods' },
            [FACTION_WHITE_NEVLAS]: { code: FACTION_WHITE_NEVLAS, planet: PLANET_TYPE_WHITE, image: 'FACnevlas' },
            [FACTION_WHITE_ITARS]: { code: FACTION_WHITE_ITARS, planet: PLANET_TYPE_WHITE, image: 'FACitars' },
        };
    }

    get factions() {
        return this.#factions
    }
    randomizeFactions(numberOfPlayers) {
        if(ifNil(numberOfPlayers)) {
            throw new Error('Factions::randomizeFactions(): numberOfPlayers is required')
        }
        const factions = {...this.#factions};
        const factionsArray = Object.values(factions);
        const random = new UniqueRandomArray( factionsArray );
        const result = [];
        while(result.length != numberOfPlayers) {
            const faction = random.random();
            
            const { planet } = faction;
            const foundSamePlanetType = result.filter((ea) => {
                return ea.planet === planet;
            }).length > 0;
            const needsMoreFactions = result.length < numberOfPlayers;
            if(!needsMoreFactions) {
                break;
            }
            if(!foundSamePlanetType) {
                result.push(faction);
            }
        }
        // for (let round = 0; round < factionsArray.length; round++) {
        // }
        return result;
    }
}


export default Factions
