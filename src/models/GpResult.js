import { generate } from "randomstring";

class GpResult {
  #data;
  constructor(data) {
    const now = new Date();
    this.#data = {
      ...data,
      extId: data.extId || this.generateNewUniqueId(now),
      createAt: data.createAt || now.toJSON(),
      updateAt: now.toJSON(),
    };
  }

  toJSON() {
    return this.#data;
  }

  generateNewUniqueId(now = new Date()) {
    return `${generate({
      length: 24,
      charset: "alphanumeric",
    })}-${Math.floor(now.valueOf() / 1000)}`;
  }
}
export default GpResult;
