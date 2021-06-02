import HexMap from 'src/models/HexMap';
import Hexagon5x5MapNo10 from 'src/models/Hexagon5x5Map/mapNo10/Hexagon5x5MapNo10';
import Factions from 'src/models/Factions';
import GpResult from 'src/models/GpResult';
import GpResultsCollection from 'src/models/GpResultsCollection';
import mongodb from 'src/middlewares/mongoDb';
import errorBody from 'src/middlewares/responseMiddlewares/errorBody';

export default async (req, res) => {
const {resultId} = req.query;
  const conn = mongodb();
  await conn.connectToDatabase();

  // const gpResult = new GpResult(config);
  const gpCollection = new GpResultsCollection();
  try {
    
    const [result] = await conn.find(null, { extId: resultId }, gpCollection);

    // collection.insertMany([{ a: 1 }, { a: 2 }, { a: 3 }], function(err, s) {
    //   if(err) {
    //     throw err;
    //   }
    //   // assert.equal(err, null);
    //   // assert.equal(3, result.result.n);
    //   // assert.equal(3, result.ops.length);
    //   console.log('Inserted 3 documents into the collection');
    //   callback(result);
    // });

    res.status(200).json({ result, timestamp: new Date() });
    // return close();
  } catch (error) {
    console.error(`${error}`);
    res.status(error.status || 500).json(errorBody(error.message));
  }
}
