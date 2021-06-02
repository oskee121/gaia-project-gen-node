import HexMap from 'src/models/HexMap';
import Hexagon5x5MapNo1 from 'src/models/Hexagon5x5Map/mapNo1/Hexagon5x5MapNo1';
import Hexagon5x5MapNo2 from 'src/models/Hexagon5x5Map/mapNo2/Hexagon5x5MapNo2';
import Hexagon5x5MapNo3 from 'src/models/Hexagon5x5Map/mapNo3/Hexagon5x5MapNo3';
import Hexagon5x5MapNo4 from 'src/models/Hexagon5x5Map/mapNo4/Hexagon5x5MapNo4';
import Hexagon5x5MapNo5 from 'src/models/Hexagon5x5Map/mapNo5/Hexagon5x5MapNo5';
import Hexagon5x5MapNo5Outline from 'src/models/Hexagon5x5Map/mapNo5/Hexagon5x5MapNo5_1p2p';
import Hexagon5x5MapNo6 from 'src/models/Hexagon5x5Map/mapNo6/Hexagon5x5MapNo6';
import Hexagon5x5MapNo6Outline from 'src/models/Hexagon5x5Map/mapNo6/Hexagon5x5MapNo6_1p2p';
import Hexagon5x5MapNo7 from 'src/models/Hexagon5x5Map/mapNo7/Hexagon5x5MapNo7';
import Hexagon5x5MapNo7Outline from 'src/models/Hexagon5x5Map/mapNo7/Hexagon5x5MapNo7_1p2p';
import Hexagon5x5MapNo8 from 'src/models/Hexagon5x5Map/mapNo8/Hexagon5x5MapNo8';
import Hexagon5x5MapNo9 from 'src/models/Hexagon5x5Map/mapNo9/Hexagon5x5MapNo9';
import Hexagon5x5MapNo10 from 'src/models/Hexagon5x5Map/mapNo10/Hexagon5x5MapNo10';
import Factions from 'src/models/Factions';
import Boosters from 'src/models/Boosters';
import AdvanceTechTiles from 'src/models/AdvanceTechTiles';
import StandardTechTiles from 'src/models/StandardTechTiles';
import Federations from 'src/models/Federations';
import RoundScoreTiles from 'src/models/RoundScoreTiles';
import FinalScoreTiles from 'src/models/FinalScoreTiles';
import GpResult from 'src/models/GpResult';
import GpResultsCollection from 'src/models/GpResultsCollection';
import mongodb from 'src/middlewares/mongoDb';
import UniqueRandomArray from 'src/utils/UniqueRandomArray';
import cookies from 'src/middlewares/cookies';
import errorBody from 'src/middlewares/responseMiddlewares/errorBody';
import createError from 'http-errors';


async function postGenerate(req,res) {
  try {
    // connect database
    const conn = mongodb();
    await conn.connectToDatabase();

    const factions = new Factions();

    const boosters = new Boosters();

    const advanceTechTiles = new AdvanceTechTiles();
    const standardTechTiles = new StandardTechTiles();
    const federations = new Federations();
    const roundScoreTiles = new RoundScoreTiles();
    const finalScoreTiles = new FinalScoreTiles();

    const { players } = req.body;
    const numberOfPlayers = players.length;
    if(numberOfPlayers < 1 || numberOfPlayers > 4) {
      throw new createError.BadRequest('incorrect params');
    }
    const uniquePlayers = ((p) => {
      function onlyUnique(value, index, self) {
        return self.indexOf(value.trim()) === index;
      }
      let unique = p.map(value => value.trim()).filter(onlyUnique);
      return unique;
    })(players);
    const playerNameIsDuplicated = uniquePlayers.length !== players.length;
    if(playerNameIsDuplicated) {
      throw new createError.BadRequest('some players are duplicated');
    }

    const hexMap = new HexMap(19, 17); // For 10 maps
    const no1Map = new Hexagon5x5MapNo1();
    const no2Map = new Hexagon5x5MapNo2();
    const no3Map = new Hexagon5x5MapNo3();
    const no4Map = new Hexagon5x5MapNo4();
    const no5Map = new Hexagon5x5MapNo5();
    const no5MapOutline = new Hexagon5x5MapNo5Outline();
    const no6Map = new Hexagon5x5MapNo6();
    const no6MapOutline = new Hexagon5x5MapNo6Outline();
    const no7Map = new Hexagon5x5MapNo7();
    const no7MapOutline = new Hexagon5x5MapNo7Outline();
    const no8Map = new Hexagon5x5MapNo8();
    const no9Map = new Hexagon5x5MapNo9();
    const no10Map = new Hexagon5x5MapNo10();
    
    // console.log('Hex map generated');

    const allMaps = [];
    allMaps.push(no1Map.rotateMap(5));
    allMaps.push(no2Map.rotateMap(5));
    allMaps.push(no3Map.rotateMap(5));
    allMaps.push(no4Map.rotateMap(5));
    if(numberOfPlayers > 2) {
      allMaps.push(no5Map.rotateMap(5));
      allMaps.push(no6Map.rotateMap(5));
      allMaps.push(no7Map.rotateMap(5));
      allMaps.push(no8Map.rotateMap(5));
      allMaps.push(no9Map.rotateMap(5));
      allMaps.push(no10Map.rotateMap(5));
    } else {
      allMaps.push(no5MapOutline.rotateMap(5));
      allMaps.push(no6MapOutline.rotateMap(5));
      allMaps.push(no7MapOutline.rotateMap(5));
    }
    const uniqueRandom = new UniqueRandomArray(allMaps);
    while(uniqueRandom.random()) {
      const hexmapSection = uniqueRandom.latest;
      const { outline } = hexmapSection;
      
      const rotation = Math.floor(Math.random() * 6);
      hexmapSection.rotateMap(rotation);
      hexMap.insertMap(hexmapSection, {rotation: rotation, outline: outline});
    }
    hexMap.calculateShortestPath();

    const config = {
      boosters: boosters.randomize(numberOfPlayers),
      factions: factions.randomizeFactions(numberOfPlayers),
      advanceTechTiles: advanceTechTiles.randomize(),
      standardTechTiles: standardTechTiles.randomize(),
      federations: federations.randomize(),
      roundScoreTiles: roundScoreTiles.randomize(),
      finalScoreTiles: finalScoreTiles.randomize(),
      
      hexMap: hexMap.toJSON(),
      hexMapConfig: hexMap.getMapArray(),
      numberOfPlayers,
    }

    const gpResult = new GpResult(config);
    const gpCollection = new GpResultsCollection();

    const [id] = await conn.insertDocument(gpResult.toJSON(), gpCollection);
    
    const [{extId}] = await conn.find(id, null, gpCollection);

    // res.cookie('test', 'hello!')
    res.status(200).json({ id: extId });
  } catch (error) {
    console.error(`${error}`);
    res.status(error.status || 500).json(errorBody(error.message));
  }
}

export default cookies(async (...params) => {
  try {
    const [req, res] = params
    const {
      query: { id, name },
      method,
    } = req

    switch (method) {
      case 'POST':
        // Create data in your database
        return postGenerate(...params);
        break
      default:
        res.setHeader('Allow', ['POST'])
        return res.status(405).end();
    }
  } catch (error) {
    console.error(`${error}`);
    res.status(error.status || 500).json(errorBody(error.message));
  }

})
