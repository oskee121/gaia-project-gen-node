import Hex from 'src/models/Hex';
import {ifNil} from 'src/utils/ifNull';

class HexMap {
    #mapCenter;
    #map4Center;
    #mapArray;
    constructor(w, h, options) {
        if(ifNil(w)) {
            throw new Error("HexMap::constructor: w is required");
        }
        if(ifNil(h)) {
            throw new Error("HexMap::constructor: h is required");
        }
        this._mapHeight = h;
        this._mapWidth = w;
        this._hexMap = [];
        this._hexMapHash = {};
        this.neighborAxialDirections = [
            {q:+1,r: 0},
            {q:+1,r: -1},
            {q: 0,r: -1},
            {q:-1,r: 0},
            {q:-1,r: +1},
            {q: 0,r: +1},
        ];
        this.sectionMembers = [
            {q:0, r:-2},
            {q:1, r:-2},
            {q:2, r:-2},
            {q:-1, r:-1},
            {q:0, r:-1},
            {q:1, r:-1},
            {q:2, r:-1},
            {q:-2, r:0},
            {q:-1, r:0},
            {q:0, r:0},
            {q:1, r:0},
            {q:2, r:0},
            {q:-2, r:1},
            {q:-1, r:1},
            {q:0, r:1},
            {q:1, r:1},
            {q:-2, r:2},
            {q:-1, r:2},
            {q:0, r:2},
        ];
        // map orientation
        //  1 2 8
        // 3 4 5 9
        //  6 7 10
        this.#map4Center = {q:4, r:9};
        this.#mapCenter = [
            {q: this.#map4Center.q - 2, r: this.#map4Center.r - 3 },
            {q: this.#map4Center.q + 3 , r: this.#map4Center.r - 5},
            {q: this.#map4Center.q - (5) , r: this.#map4Center.r + 2},
            {q: this.#map4Center.q, r: this.#map4Center.r},
            {q: this.#map4Center.q + 5 , r: this.#map4Center.r - 2},
            {q: this.#map4Center.q - (3) , r: this.#map4Center.r + 5},
            {q: this.#map4Center.q + 2 , r: this.#map4Center.r + 3},
            {q: this.#map4Center.q + 8 , r: this.#map4Center.r - 7},
            {q: this.#map4Center.q + 10 , r: this.#map4Center.r - 4},
            {q: this.#map4Center.q + 7 , r: this.#map4Center.r + 1},
        ];
        this.#mapArray = [];
        this._generateHexMap();
    }
    get map() {
        return this._hexMap;
    }
    getAt(q, r) {
        if(ifNil(q)) {
            throw new Error("HexMap::getAt: q is required");
        }
        if(ifNil(r)) {
            throw new Error("HexMap::getAt: r is required");
        }
        return this._hexMapHash[this._createMapKey(q, r)] || null;
    }
    getCoor(y, x) {
        if(ifNil(y)) {
            throw new Error("HexMap::getCoor: y is required");
        }
        if(ifNil(x)) {
            throw new Error("HexMap::getCoor: x is required");
        }
        return this._hexMap[y][x] || null;
    }
    updateAt(q, r, params) {
        if(ifNil(q)) {
            throw new Error("HexMap::updateAt: q is required");
        }
        if(ifNil(r)) {
            throw new Error("HexMap::updateAt: r is required");
        }
        if(ifNil(params)) {
            throw new Error("HexMap::updateAt: params is required");
        }
    
        const {traverse, current, planet} = params;
        if(traverse) {
            this._hexMapHash[this._createMapKey(q, r)].setTraverse(traverse);
        }
        if(current) {
            this._hexMapHash[this._createMapKey(q, r)].setCurrent(current);
        }
        
    }
    replaceHex(target, replacer) {
        const hex1 = this._hexMapHash[this._createMapKey(...target)];
        const hex2 = new Hex(replacer);
        const {q:q1, r:r1, coor:[x1, y1]} = hex1;
        const hex = new Hex({...hex2.toJSON(), coor: [x1, y1], q:q1, r:r1})
        this._hexMapHash[this._createMapKey(...target)] = hex;
        this._hexMap[x1][y1] = hex;
    }
    insertMap(map, {rotation, outline}) {
        const sectionNumber = this.#mapArray.length;
        const sectionCenter = this.#mapCenter[sectionNumber];
        const jsonMap = map.toJSON();
        this.#mapArray.push({no: map.label, rotation, outline});
        return this.sectionMembers.map(({q:dQ, r:dR}) => {
            return this.replaceHex([sectionCenter.q + dQ, sectionCenter.r + dR], jsonMap[this._createMapKey(1+dQ, 2+dR)]);
        }).filter(hex => !!hex)
    }
    setPlanet(q, r, planetConstant) {
        if(ifNil(q)) {
            throw new Error("HexMap::setPlanet: q is required");
        }
        if(ifNil(r)) {
            throw new Error("HexMap::setPlanet: r is required");
        }
        if(ifNil(planetConstant)) {
            throw new Error("HexMap::setPlanet: planetConstant is required");
        }
        this._hexMapHash[this._createMapKey(q, r)].setPlanet(planetConstant);
    }
    getNeighbors(q, r) {
        return this.neighborAxialDirections.map(({q:dQ, r:dR}) => {
            return this.getAt(q + dQ, r + dR);
        }).filter(hex => !!hex)
    }
    traverseFrom({q, r}, numberOfStep) {
        this.clear();
        let center = [{q, r}];
        this.updateAt(q, r, { current: true });
        return  this._traversal([this, center], numberOfStep);
    }
    toJSON() {
        const obj = {};
        Object.entries(this._hexMapHash)
            .map(([key, hex]) => {
                obj[key] = hex.toJSON();
            });
        return obj;
    }
    toString() { 
        return `${
            this._hexMap.map((row) => {
            return row.map((hex) => {
                return hex.toString();
            }).join(' | ')
            }).join('\n')
        }`
    };
    clear() {
        Object.keys(this._hexMapHash).map((key) => this._hexMapHash[key].clearStatus());
    }
    getDistance(hexA, hexB) {
        let distance = 2;
        let found = false;
        while(distance < 10 && !found) {
            const [_, planets] = this.traverseFrom(hexA, distance);
            found = planets.filter(({q, r}) => {
              return hexB.q===q && hexB.r === r;
            }).length > 0;
            distance++;
        }
        if(found) {
            return distance;
        }
        return -1;
    }
    getMapArray() {
        return this.#mapArray;
    }
    calculateShortestPath() {
        console.log(this._hexMapHash);
    }

    // Private Function below
    _createMapKey(q, r) {
        return `Q${q}_R${r}`;
    }
    _generateHexMap() {
        for (let row = 0; row < this._mapHeight; row++) {
            this._hexMap.push([]);
            for (let column = 0 - Math.floor(row / 2); column < this._mapWidth - Math.floor(row / 2); column++) {
                const q = column;
                const r = row;
                const mapKey = this._createMapKey(q, r);
                this._hexMapHash[mapKey] = new Hex({q:column, r:row,coor: [row, this._hexMap[row].length]})
                this._hexMap[row].push(this._hexMapHash[mapKey]);
            }
        }
    }
    _traversal([hexMap, startingList, planets, step = 1], numberOfStep) {
        
        if(step > numberOfStep || startingList.length === 0) {
            return [startingList, planets];
        }

        return this._traversal(((map, start, st)=>{
            const newStart = [];
            const newPlanets = [];
            start.map((ct) => {
                const neighbors = map.getNeighbors(ct.q,ct.r);
                return neighbors.map(hex => {
                    if(hex.traversable()) {
                        map.updateAt(hex.q, hex.r, { traverse: st });
                        newStart.push(hex);
                    }
                    if(hex.hasPlanet()) {
                        newPlanets.push(hex);
                    }
                });
            });
            return [map, newStart, newPlanets, st+1];
        })(hexMap, startingList, step), numberOfStep)
    }
}
export default HexMap;
