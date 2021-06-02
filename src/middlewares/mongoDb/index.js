import { MongoClient, ObjectId } from 'mongodb'
import {ifNil} from 'src/utils/ifNull';

const mongodb = (options={}) => {
  const { mongoDbUri, mongoDbDatabaseName} = options
  const { MONGODB_URI=mongoDbUri, MONGODB_DB=mongoDbDatabaseName } = process.env
  
  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    )
  }
  
  if (!MONGODB_DB) {
    throw new Error(
      'Please define the MONGODB_DB environment variable inside .env.local'
    )
  }
  
  /**
   * Global is used here to maintain a cached connection across hot reloads
   * in development. This prevents connections growing exponentially
   * during API Route usage.
   */
  let cached = global.mongo
  
  if (!cached) {
    cached = global.mongo = { conn: null, promise: null }
  }

  return {
    connectToDatabase,
    find,
    insertDocument,
    insertDocuments
  };

  /**
   * ############### ALL FUNCTIONS ARE BELOW ###############
   */

  async function connectToDatabase() {
    try {
      if (cached.conn) {
        return cached.conn;
      }
    
      if (!cached.promise) {
        const opts = {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
    
        cached.promise = MongoClient.connect(MONGODB_URI, opts).then((client) => {
          return {
            client,
            db: client.db(MONGODB_DB),
            close: () => client.close()
          }
        })
      }
      cached.conn = await cached.promise.catch((err) => {
        console.error('Connect Error');
        cached.conn = cached.promise = null;
        throw err;
      });
    
      const { client } = cached.conn;
    
      const isConnected = await client.isConnected();
      if(!isConnected) {
        throw new Error('Can not connect MongoDB');
      }
    
      return cached.conn;
    } catch (error) {
      throw error;
    }
  }

  async function find(id, criteria, {collectionName}) {
    try {
      if (!cached.conn) {
        throw new Error('Active Connection Not Found');
      }
      return new Promise(async (resolve, reject) => {
        const { db } = cached.conn;
        const collection = db.collection(collectionName);
        const searchParam = {};
        let haveCreteria = false;
 
        if(!ifNil(id)) {
          searchParam['_id'] = new ObjectId(id);
          haveCreteria = true;
        }
        
        if(!ifNil( criteria)) {
          const {extId} = criteria || {};
          if(!ifNil(extId)) {
            searchParam['extId'] = extId;
            haveCreteria = true;
          }
        }
 
        if(!haveCreteria) {
          throw new Error('mongoDB.find: not found any criteria');
        }
  
        const resultList = await collection
          .find(searchParam)
          .toArray();
        return resolve(resultList);
      }); 
    } catch (error) {
      throw e;
    }
  }

  async function insertDocument(doc, {collectionName}) {
    return insertDocuments([doc], {collectionName});
  }

  async function insertDocuments(documents, {collectionName}) {
    if (!cached.conn) {
      throw new Error('Active Connection Not Found');
    }

    const documentsIsValidArray = Array.isArray(documents);
    if(!documentsIsValidArray) {
      throw new Error('Invalid documents data');
    }

    try {
      return new Promise(async (resolve, reject) => {
        const { db } = cached.conn;

        // Get the documents collection
        const collection = db.collection(collectionName);
        // Insert some documents
        return collection.insertMany(documents, function(err, result) {
          if(err) {
            return reject(err);
          }
          const inserted = result.ops;
          const insertedIds = inserted.map(({ _id })=> _id);
          // assert.equal(err, null);
          // assert.equal(3, result.result.n);
          // assert.equal(3, result.ops.length);
          return resolve(insertedIds);
        });
      })
    } catch (e) {
      throw e;
    }
  }


}
export default mongodb
