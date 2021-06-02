import {ifNil} from 'src/utils/ifNull';
import {
    PLANET_TYPE_GAIA_PLANET,
    PLANET_TYPE_EARTH,
    PLANET_TYPE_RED,
    PLANET_TYPE_ORANGE,
    PLANET_TYPE_YELLOW,
    PLANET_TYPE_BROWN,
    PLANET_TYPE_BLACK,
    PLANET_TYPE_WHITE,
    PLANET_TYPE_TRANSDIM,
} from 'src/models/Planet';

class Hex {
    #label;
    #rotate;
    constructor({q, r, coor, planet, label, rotate}) {
      this.q = q;
      this.r = r;
      this._coor = coor;
      this._status = null;
      this._statusValue = null;
      this._planet = planet || null;
      this.#label = label || '';
      this.#rotate = rotate || 1;
    }
    get traverse() {
        return this._traverse
    }
    get coor() {
        return this._coor;
    }
    get current() {
        return this._current
    }
    get planet() {
        return this._planet
    }
    set coor(value) {
        if(ifNil(value)) {
            throw new Error('Hex::coor::setter: value is not set')
        }
        this._coor = value
    }
    get label() {
        return this.#label
    }
    set label(value) {
        if(ifNil(value)) {
            throw new Error('Hex::label::setter: value is not set')
        }
        this.#label = value
    }
    get rotate() {
        return this.#rotate
    }
    
    rotate() {
        // 0 > 1 > 2 > 3 > 4 > 5 >> 0
        this.#rotate = ( this.#rotate + 1 ) % 6;
    }
    
    
    setTraverse(value) {
        if(ifNil(value)) {
            throw new Error('Hex::setTraverse: value is not set')
        }
        this._status = 'traverse';
        this._statusValue = value;
    }
    setCurrent(value) {
        if(ifNil(value)) {
            throw new Error('Hex::setCurrent: value is not set')
        }
        this._status = 'current'
        this._statusValue = value
    }
    setPlanet(value) {
        if(ifNil(value)) {
            throw new Error('Hex::setPlanet: value is not set')
        }
        switch (value) {
            case PLANET_TYPE_GAIA_PLANET:
            case PLANET_TYPE_EARTH:
            case PLANET_TYPE_RED:
            case PLANET_TYPE_ORANGE:
            case PLANET_TYPE_YELLOW:
            case PLANET_TYPE_BROWN:
            case PLANET_TYPE_BLACK:
            case PLANET_TYPE_WHITE:
            case PLANET_TYPE_TRANSDIM:
                this._planet = value;
                break;
            default:
                throw new Error('Hex::setPlanet: value should be a number')
                break;
        }
    }
    toJSON() {
        return {
            q: this.q,
            r: this.r,
            coor: this._coor,
            // status: this._status,
            // statusValue: this._statusValue,
            planet: this._planet,
        }
    }
    toString()  { 
        return `"${this.q},${this.r}${
            this._status === 'traverse'?' t'+this._statusValue:''
        }${
            this._status === 'current'?' c':''
        }${
            this._planet?' p:'+ this._planet:''
        } (${JSON.stringify(this._coor)})"`;
    }
    clearStatus() {
        delete this._status;
    }
    traversable() {
        const traversed = this._status === 'traverse';
        const current = this._status === 'current';
        const hasPlanet = false;
        return !traversed && !current && !hasPlanet;
    }
    hasPlanet() {
        const hasPlanet = !!this._planet;
        return hasPlanet;
    }
  }
export default Hex;
