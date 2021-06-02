import UniqueRandomArray from 'src/utils/UniqueRandomArray';
import {ifNil} from 'src/utils/ifNull';

class Boosters {
    #boosters;
    constructor() {
        this.#boosters = [
            "BOOgai",
            "BOOknw",
            "BOOlab",
            "BOOmin",
            "BOOnav",
            "BOOpia",
            "BOOpwt",
            "BOOqic",
            "BOOter",
            "BOOtrs"
        ]
    }

    randomize(numberOfPlayers) {
        if(ifNil(numberOfPlayers)) {
            throw new Error('Boosters::randomize(): numberOfPlayers is required')
        }

        const randomizer = new UniqueRandomArray(this.#boosters);
        const result = [];
        while(result.length !== numberOfPlayers+3) {
            result.push(randomizer.random());
        }
        
        return result;
    }
}


export default Boosters
