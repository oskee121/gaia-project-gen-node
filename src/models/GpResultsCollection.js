class GpResultsCollection {
  #collectionName;
  constructor() {
    const { MONGODB_COLLECTION: mongoDBCollection } = process.env;
    if( !mongoDBCollection ) {
      throw new Error('MONGODB_COLLECTION is not defined')
    }
    this.#collectionName = mongoDBCollection;
  }

  get collectionName() {
    return this.#collectionName;
  }
}
export default GpResultsCollection;
