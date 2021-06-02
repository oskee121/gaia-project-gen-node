import UniqueRandomArray from 'src/utils/UniqueRandomArray';

class FinalScoreTiles {
    #tiles;
    constructor() {
        this.#tiles = [
            "FINbld",
            "FINfed",
            "FINgai",
            "FINsat",
            "FINsec",
            "FINtyp",
        ]
    }

    randomize() {
        const randomNumber = 2;
        const randomizer = new UniqueRandomArray(this.#tiles);
        const result = [];
        while(result.length !== randomNumber) {
            result.push(randomizer.random());
        }
        
        return result;
    }
}


export default FinalScoreTiles
