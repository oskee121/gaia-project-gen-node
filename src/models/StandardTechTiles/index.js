import UniqueRandomArray from 'src/utils/UniqueRandomArray';

class StandardTechTiles {
    #tiles;
    constructor() {
        this.#tiles = [
            "TECcre",
            "TECgai",
            "TECknw",
            "TECore",
            "TECpia",
            "TECpow",
            "TECqic",
            "TECtyp",
            "TECvps"   ,
        ]
    }

    randomize() {
        const randomNumber = 9;
        const randomizer = new UniqueRandomArray(this.#tiles);
        const result = [];
        while(result.length !== randomNumber) {
            result.push(randomizer.random());
        }
        
        return result;
    }
}


export default StandardTechTiles
