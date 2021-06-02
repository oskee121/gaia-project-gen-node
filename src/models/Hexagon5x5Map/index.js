import Hex from "../Hex";
import HexMap from "../HexMap";

//                      "1,0 ([0,1])" | "2,0 ([0,2])" | "3,0 ([0,3])"
//              "0,1 ([1,0])"    | "1,1 ([1,1])" | "2,1 ([1,2])" | "3,1 ([1,3])"
//   "-1,2 ([2,0])" | "0,2 ([2,1])"   | "1,2 ([2,2])" | "2,2 ([2,3])" | "3,2 ([2,4])"
//               "-1,3 ([3,0])"  | "0,3 ([3,1])" | "1,3 ([3,2])" | "2,3 ([3,3])"
//                      "-1,4 ([4,1])" | "0,4 ([4,2])" | "1,4 ([4,3])"
class Hexagon5x5Map extends HexMap {
  #label;
  #outline;
  constructor(options) {
    super(5, 5, options);
    const removeList = [
      [2, 4],
      [-2, 4],
      [3, 3],
      [4, 1],
      [4, 0],
      [0, 0],
    ];
    removeList.map(([q, r]) => {
      let hex = this._hexMapHash[this._createMapKey(q, r)];
      // console.log('removing coor:'+hex.coor[0]+','+hex.coor[1]);
      this._hexMap[hex.coor[0]].splice(hex.coor[1], 1);
      // console.log('removing q,r:'+q+','+r);
      delete this._hexMapHash[this._createMapKey(q, r)];
    });
    this._resetCoor();
    // delete this._hexMapHash[this._createMapKey(6,4)];
    // delete this._hexMapHash[this._createMapKey(5,5)];
    this._rotateDirections = {
      [this._createMapKey(1, 0)]: [3, 0],
      [this._createMapKey(2, 0)]: [3, 1],
      [this._createMapKey(3, 0)]: [3, 2],

      [this._createMapKey(0, 1)]: [2, 0],
      [this._createMapKey(1, 1)]: [2, 1],
      [this._createMapKey(2, 1)]: [2, 2],
      [this._createMapKey(3, 1)]: [2, 3],

      [this._createMapKey(-1, 2)]: [1, 0],
      [this._createMapKey(0, 2)]: [1, 1],
      [this._createMapKey(1, 2)]: [1, 2],
      [this._createMapKey(2, 2)]: [1, 3],
      [this._createMapKey(3, 2)]: [1, 4],

      [this._createMapKey(-1, 3)]: [0, 1],
      [this._createMapKey(0, 3)]: [0, 2],
      [this._createMapKey(1, 3)]: [0, 3],
      [this._createMapKey(2, 3)]: [0, 4],

      [this._createMapKey(-1, 4)]: [-1, 2],
      [this._createMapKey(0, 4)]: [-1, 3],
      [this._createMapKey(1, 4)]: [-1, 4],
    };
    this.#label = options.label;
    this.#outline = options.outline;
  }

  rotateMap(numberOfTime = 1) {
    if (numberOfTime === 0) {
      // return arr1
      return this;
    }
    // console.log('::'+JSON.stringify(this._hexMapHash[this._createMapKey(2, 0)].toJSON()));
    const jsonMap = this.toJSON();
    // console.log('=='+JSON.stringify(jsonMap));

    //                  "1,0 ([0,1])" | "2,0 ([0,2])" | "3,0 ([0,3])"
    //         "0,1 ([1,0])" | "1,1 ([1,1])" | "2,1 ([1,2])" | "3,1 ([1,3])"
    // "-1,2 ([2,0])" | "0,2 ([2,1])" | "1,2 ([2,2])" | "2,2 ([2,3])" | "3,2 ([2,4])"
    //         "-1,3 ([3,0])" | "0,3 ([3,1])" | "1,3 ([3,2])" | "2,3 ([3,3])"
    //                 "-1,4 ([4,1])" | "0,4 ([4,2])" | "1,4 ([4,3])"

    // while
    Object.entries(this._rotateDirections).map(([k, v]) => {
      return this.replaceHex(v, jsonMap[k]);
    });
    return this.rotateMap(numberOfTime - 1);

    // return rotateMap(numberOfTime - 1);

    // console.log('::'+JSON.stringify(this._hexMapHash[this._createMapKey(2, 0)].toJSON()));
    // this._hexMapHash[this._createMapKey(1, 1)].q = 1;
    // this._hexMapHash[this._createMapKey(1, 1)].r = 1;
    // return rotateHex5x5([
    //     [ arr1[0][0],       arr1[2][0],           arr1[1][0],       arr1[0][1],         arr1[0][4]],
    //     [       arr1[3][0],             arr1[2][1],       arr1[1][1],         arr1[0][2]],
    //     [ arr1[4][1],       arr1[3][1],           arr1[2][2],       arr1[1][2],         arr1[0][3]],
    //     [       arr1[4][2],            arr1[3][2],             arr1[2][3],    arr1[1][3]],
    //     [ arr1[4][0],       arr1[4][3],           arr1[3][3],       arr1[2][4],         arr1[4][4]],
    // ], numberOfTime-1);
  }

  _resetCoor() {
    for (let row = 0; row < this._hexMap.length; row++) {
      for (let column = 0; column < this._hexMap[row].length; column++) {
        const { q, r } = this._hexMap[row][column];
        this._hexMapHash[this._createMapKey(q, r)].coor = [row, column];
      }
    }
  }

  get label() {
    return this.#label;
  }
  get outline() {
      return this.#outline
  }
}
export default Hexagon5x5Map;
