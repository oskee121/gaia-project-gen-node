export default class UniqueRandomArray {
  #array;
  #originalArray;
  // #itemLength;
  #latest;
  constructor(array) {
    this.#array = array || [];
    this.#originalArray = [...(array || [])];
    // this.#itemLength = array?.length || 0;
  }
  random(options={}) {
    if (this.itemLength() === 0) {
      return false;
    }
    if(options.verbose) {
      console.trace(JSON.stringify(this.#array));
    }
    this.shuffleItems();
    const rand = Math.floor(Math.random() * this.itemLength());
    const [out] = this.#array.splice(rand, 1);
    this.#latest = out;
    // this.#itemLength = this.#array.length;
    return this.#latest;
  }
  reset() {
    this.#array = [...this.#originalArray];
    // this.#itemLength = this.#array.length;
  }
  get latest() {
    return this.#latest;
  }
  itemLength() {
    return this.#array?.length || 0;
  }
  shuffleItems(times=this.itemLength()-1) {
    if(times<1) {
      return true;
    }
    this.#array = [...this.#array].sort(() => Math.random() - 0.5);
    return this.shuffleItems(times-1);
  }
}
