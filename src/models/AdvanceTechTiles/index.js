import UniqueRandomArray from 'src/utils/UniqueRandomArray';

class AdvanceTechTiles {
    #tiles;
    constructor() {
        this.#tiles = [
            'ADVfedP',  
            'ADVfedV',  
            'ADVgai',   
            'ADVknw',   
            'ADVlab',   
            'ADVminB',  
            'ADVminV',  
            'ADVore',   
            'ADVqic',   
            'ADVsecO',  
            'ADVsecV',  
            'ADVstp',   
            'ADVtrsB',  
            'ADVtrsV',  
            'ADVtyp',   
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


export default AdvanceTechTiles
