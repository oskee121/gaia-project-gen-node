import Hexagon5x5Map from "..";
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
} from "src/models/Planet";

//                      "1,0 ([0,1])" | "2,0 ([0,2])" | "3,0 ([0,3])"
//              "0,1 ([1,0])"    | "1,1 ([1,1])" | "2,1 ([1,2])" | "3,1 ([1,3])"
//   "-1,2 ([2,0])" | "0,2 ([2,1])"   | "1,2 ([2,2])" | "2,2 ([2,3])" | "3,2 ([2,4])"
//               "-1,3 ([3,0])"  | "0,3 ([3,1])" | "1,3 ([3,2])" | "2,3 ([3,3])"
//                      "-1,4 ([4,1])" | "0,4 ([4,2])" | "1,4 ([4,3])"
class Hexagon5x5MapNo2 extends Hexagon5x5Map {
  constructor() {
    super({ label: "02" });
    this.setPlanet(-1, 3, PLANET_TYPE_RED);
    this.setPlanet(0, 2, PLANET_TYPE_BROWN);
    this.setPlanet(0, 4, PLANET_TYPE_TRANSDIM);
    this.setPlanet(2, 0, PLANET_TYPE_ORANGE);
    this.setPlanet(2, 2, PLANET_TYPE_WHITE);
    this.setPlanet(2, 3, PLANET_TYPE_YELLOW);
    this.setPlanet(3, 0, PLANET_TYPE_BLACK);
  }
}
export default Hexagon5x5MapNo2;
