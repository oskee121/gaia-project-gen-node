import UniqueRandomArray from 'src/utils/UniqueRandomArray';

class RoundScoreTiles {
    #tiles;
    constructor() {
        this.#tiles = [
            'RNDfed',
            'RNDgai3',
            'RNDgai4',
            'RNDmin',
            'RNDpia', // have 2 of this
            'RNDpia', // have 2 of this
            'RNDstp',
            'RNDter',
            'RNDtrs3',
            'RNDtrs4',
        ]
    }

    randomize() {
        const randomNumber = 6;
        const randomizer = new UniqueRandomArray(this.#tiles);
        const result = [];
        while(result.length !== randomNumber) {
            result.push(randomizer.random());
        }
        
        return result;
    }
}


export default RoundScoreTiles
