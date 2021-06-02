import UniqueRandomArray from 'src/utils/UniqueRandomArray';

class Federadions {
    #tiles;
    constructor() {
        this.#tiles = [
            'FEDcre',
            // 'FEDgle',
            'FEDknw',
            'FEDore',
            'FEDpwt',
            'FEDqic',
            'FEDvps',
        ]
    }

    randomize() {
        const randomNumber = 1;
        const randomizer = new UniqueRandomArray(this.#tiles);
        const result = [];
        while(result.length !== randomNumber) {
            result.push(randomizer.random());
        }
        
        return result;
    }
}


export default Federadions
