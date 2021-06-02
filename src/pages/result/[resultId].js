import Head from 'next/head';
import Image from 'next/image'
import { useRouter } from "next/router";
// import 'src/styles/Hex.css';
import httpCli from "src/middlewares/httpCli";
import errorBody from 'src/middlewares/responseMiddlewares/errorBody';
///
import { HexGrid, Layout, Hexagon, Text, Pattern, Path, Hex } from 'react-hexgrid';
///
import styles from './styles/result.module.scss';
import hexStyles from './styles/hex.module.scss';

///
// const Honeycomb = require('honeycomb-grid')

// const Grid = Honeycomb.defineGrid()
// Grid.rectangle({ width: 4, height: 4 })
///

export default function Result(props) {
  const router = useRouter();
  if(props.error) {
    return (
      <div className={styles.container}>
        <Head>
          <title>GP Gen Node</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div>{props.error.code} {props.error.msg}</div>
        <p className={styles.description}>
          <a
            href="/"
          >
          Re generate
          </a>
        </p>
        <footer className={styles.footer}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Gaia Gen App
          </a>
        </footer>
      </div>
    )
  }

  const arrowUpSolid = '⬆';
  const arrowUpOutline = '⇧';
    const hexagonSize = { x: 4, y: 4 };
    const mapDirections = [
      {x:-2, z:2, y:0,    dQ:-2, dR:2    },
      {x:-1, z:2, y:-1,   dQ:-1, dR:2    },
      {x:0, z:2, y:-2,    dQ:0, dR:2    },
      {x:-2, z:1, y:1,    dQ:-2, dR:1    },
      {x:-1, z:1, y:0,    dQ:-1, dR:1    },
      {x:0, z:1, y:-1,    dQ:0, dR:1    },
      {x:1, z:1, y:-2,    dQ:1, dR:1    },
      {x:-2, z:0, y:2,    dQ:-2, dR:0    },
      {x:-1, z:0, y:1,    dQ:-1, dR:0    },
      {x:0, z:0, y:0,     dQ:0, dR:0    },
      {x:1, z:0, y:-1,    dQ:1, dR:0    },
      {x:2, z:0, y:-2,    dQ:2, dR:0    },
      {x:-1, z:-1, y:2,   dQ:-1, dR:-1    },
      {x:0, z:-1, y:1,    dQ:0, dR:-1    },
      {x:1, z:-1, y:0,    dQ:1, dR:-1    },
      {x:2, z:-1, y:-1,   dQ:2, dR:-1    },
      {x:0, z:-2, y:2,    dQ:0, dR:-2    },
      {x:1, z:-2, y:1,    dQ:1, dR:-2    },
      {x:2, z:-2, y:0,    dQ:2, dR:-2    },
    ]; 
    // 4:-4.1.-25
    // 3:-5.0.-2
    const map4Center = {x:-4, z:2, y:2, q: 4, r: 9};
    const mapCenter = [
      // -11|1|10
      {x:map4Center.x+(-2), z:map4Center.z+(-3), y:map4Center.y+(5), q: map4Center.q - 2, r: map4Center.r - 3 , minPlayers: 1},
      // -6|-1|7
      {x:map4Center.x+(3), z:map4Center.z+(-5), y:map4Center.y+(2), q: map4Center.q + 3 , r: map4Center.r - 5, minPlayers: 1},
      // -14|6|8
      {x:map4Center.x+(-5), z:map4Center.z+(2), y:map4Center.y+(3), q: map4Center.q - (5) , r: map4Center.r + 2, minPlayers: 1},
      {x:map4Center.x+(0), z:map4Center.z+(0), y:map4Center.y+(0), q: map4Center.q, r: map4Center.r, minPlayers: 1},
      // -3|1|2
      // -4.2.-12
      {x:map4Center.x+(5), z:map4Center.z+(-2), y:map4Center.y+(-17), q: map4Center.q + 5 , r: map4Center.r - 2, minPlayers: 1},
      // -7|7|0
      {x:map4Center.x+(-3), z:map4Center.z+(5), y:map4Center.y+(-2), q: map4Center.q - (3) , r: map4Center.r + 5, minPlayers: 1},
      // -2|5|-3
      {x:map4Center.x+(2), z:map4Center.z+(3), y:map4Center.y+(-5), q: map4Center.q + 2 , r: map4Center.r + 3, minPlayers: 1},
      // 4|-5|1
      {x:map4Center.x+(8), z:map4Center.z+(-7), y:map4Center.y+(-1), q: map4Center.q + 8 , r: map4Center.r - 7, minPlayers: 3},
      // 6|-2|-4
      {x:map4Center.x+(10), z:map4Center.z+(-4), y:map4Center.y+(-6), q: map4Center.q + 10 , r: map4Center.r - 4, minPlayers: 3},
      // 3|3|-6
      {x:map4Center.x+(7), z:map4Center.z+(1), y:map4Center.y+(-8), q: map4Center.q + 7 , r: map4Center.r + 1, minPlayers: 3},
    ];

    const { advanceTechTiles, boosters,factions, hexMap, hexMapConfig, numberOfPlayers,standardTechTiles,federations,roundScoreTiles,finalScoreTiles } = props;

    function goBackTryAgain() {
      router.push("/");
    }
    return (
      <div className={styles.container}>
        <Head>
          <title>GP Gen Node</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <div className={styles.title}>
            <div className={styles.titleTextStyle}>
              GP Gen Node
            </div>
          </div>

          <p className={styles.description}>
            Player's Name
            <code className={styles.code}>pages/index.js</code>
          </p>
          <p className={styles.description}>
            <button type="button" onClick={() => {
              return goBackTryAgain();
            }}>
            Try again
            </button>
          </p>

          <div className={styles.techTile}>
            <div className={styles.federationsTile}>
              {federations && <Image src={"/images/federations/"+federations[0]+".png"} key={federations[0]} width="173" height="212" layout="responsive"></Image>}
            </div>

            <div className={styles.federationsTile}>
              <Image src={"/images/planets/lost-planet.png"} width="73" height="73" key="lost-planet"></Image>
            </div>
            
          </div>
          {advanceTechTiles && (
            <div className={styles.techTile}>
              {advanceTechTiles.map(adv => (
                <div className={`${styles['techTile-child']}  ${styles.techTileAdv}`}  key={adv}>
                  <Image src={"/images/advance-tech-tiles/"+adv+".png"} width="167" height="132" layout="responsive"></Image>
                </div>
              ))}
            </div>
          )}
          <table className={styles['techTile-table']}>

            {standardTechTiles && (
              <tr className={styles['techTile-row']}>
                  {standardTechTiles.filter((tile, index) => {
                  return index<6
                }).map(std => (
                  <td className={styles['techTile-cell']} key={std}>
                    <Image src={"/images/standard-tech-tiles/"+std+".png"} width="167" height="132"></Image>
                  </td>
                ))}
              </tr>
              )}
              {standardTechTiles && (
                <tr className={styles['techTile-row']}>

                  { standardTechTiles.filter((tile, index) => {
                      return index>=6
                    }).map(std => (
                      <td className={`${styles['techTile-cell']} ${styles['techTile-cell-image']}`} key={std} colspan="2">
                        <Image src={"/images/standard-tech-tiles/"+std+".png"} width="167" height="132"></Image>
                      </td>
                    ))}

                </tr>
              )}
          </table>
          <div>
            {boosters && (
              <div className={styles.boosters}>
                {boosters.map(boo => (
                  <span key={boo} className={styles['boosters-img']}>
                    <Image src={"/images/boosters/"+boo+".png"} width="102" height="298"></Image>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div>
            {roundScoreTiles && (
              <div className={styles.rounds}>
                {roundScoreTiles.map(rnd => (
                  <span key={rnd} className={styles['rounds-img']}>
                    <Image src={"/images/round-score-tiles/"+rnd+".png"} width="177" height="202" layout="responsive"></Image>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div>
            {finalScoreTiles && (
              <div className={styles.final}>
                {finalScoreTiles.map(fin => (
                  <span key={fin} className={styles['final-img']}>
                    <Image src={"/images/final-score-tiles/"+fin+".png"} width="203" height="134" layout="responsive"></Image>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className={styles.hexgrid}>
            <HexGrid width={'100%'} height={'100%'} viewBox={numberOfPlayers<=2?'-90 -50 130 100':'-75 -50 130 120'}>
              {/* //  */}
              <Layout size={hexagonSize} origin={{ x: -2, y: -2 }}>
                {/* { hexagons.map((hex, i) => <Hexagon key={i} q={hex.q} r={hex.r} s={hex.s} className={hexStyles.hexagon}>
                  <Text className={hexStyles.textSmall}>{hex.q}|{hex.r}|{hex.s}</Text>
                </Hexagon>) } */}
                  {mapCenter.filter((item) => {
                    return item.minPlayers <= numberOfPlayers;
                  }).map((center, index) => (
                    <>
                      {
                        mapDirections.map(({x,z,y,dQ,dR}) => (
                          <>
                            {
                               hexMap[`Q${center.q+dQ}_R${center.r+dR}`].planet  &&
                              (
                                <Hexagon q={center.x+x} r={center.z+z} s={center.y+y} 
                                  className={`${hexStyles.hexagon} ${hexStyles['planet-bg']}`}
                                  fill={`${hexMap[`Q${center.q+dQ}_R${center.r+dR}`].planet }`}
                                >
                                </Hexagon>
                              )
                            }
                            {
                              !(dQ === 0 && dR === 0) &&
                              !hexMap[`Q${center.q+dQ}_R${center.r+dR}`].planet &&
                              (
                                <Hexagon q={center.x+x} r={center.z+z} s={center.y+y} 
                                className={`${hexStyles.hexagon} ${hexStyles['space'+index]}`}
                                >
                                </Hexagon>
                              )
                            }
                          </>
                      ))
                      }
                    </>
                  ))}
                  {
                    mapCenter.filter((item) => {
                      return item.minPlayers <= numberOfPlayers;
                    }).map((center, index) => (
                      <Hexagon q={center.x} r={center.z} s={center.y} 
                      className={`${hexStyles.hexagon} ${hexStyles['space-text-center']}`}
                      >
                        <Text className={`${hexStyles.text} ${hexStyles['arrow-text']} ${hexStyles[`rotate${hexMapConfig[index].rotation}`]}`}>{hexMapConfig[index].outline?arrowUpOutline:arrowUpSolid}</Text>

                        <Text className={`${hexStyles.text}`}>{hexMapConfig[index].no}</Text>

                      </Hexagon>
                    ))
                  }
              </Layout>
              <Pattern id="PLANET/PLANET_TYPE_YELLOW" link={'/images/planets/planet-yellow.png'} size={{x:6.3, y:6.3}} />
              <Pattern id="PLANET/PLANET_TYPE_TRANSDIM" link={'/images/planets/planet-transdim.png'} size={{x:6.3, y:6.3}} />
              <Pattern id="PLANET/PLANET_TYPE_EARTH" link={'/images/planets/planet-earth.png'} size={{x:6.3, y:6.3}} />
              <Pattern id="PLANET/PLANET_TYPE_RED" link={'/images/planets/planet-red.png'} size={{x:6.3, y:6.3}} />
              <Pattern id="PLANET/PLANET_TYPE_GAIA_PLANET" link={'/images/planets/planet-gaia.png'} size={{x:6.3, y:6.3}} />
              <Pattern id="PLANET/PLANET_TYPE_ORANGE" link={'/images/planets/planet-orange.png'} size={{x:6.3, y:6.3}} />
              <Pattern id="PLANET/PLANET_TYPE_BROWN" link={'/images/planets/planet-brown.png'} size={{x:6.3, y:6.3}} />
              <Pattern id="PLANET/PLANET_TYPE_BLACK" link={'/images/planets/planet-black.png'} size={{x:6.3, y:6.3}} />
              <Pattern id="PLANET/PLANET_TYPE_WHITE" link={'/images/planets/planet-white.png'} size={{x:6.3, y:6.3}} />
            </HexGrid>
          </div>
          <div>
            {factions && (
              factions.map(fac => (
                <Image src={"/images/factions/"+fac.image+".jpg"} width="392" height="167" key={fac.code}></Image>
              ))
            )}
          </div>
        </main>

        <footer className={styles.footer}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Gaia Gen App
          </a>
        </footer>
      </div>
    )
}
export async function getServerSideProps(ctx)  {
    const {debug} = console;
    const itsServerSide = !!ctx.req;
    if(!itsServerSide) {
        debug("****** (!) not server side");
        return {};
    }
    debug("****** Server side");
    const { resultId } = ctx.query;
    try {
      const { body } = await httpCli({
        url: '/api/result/' + resultId
      });
      console.log(body);
      if(!body.result) {
        return { 
          props: { 
            error: {
              code: 404,
              msg: 'not_found'
            }
          }
        };
      }
      const { advanceTechTiles, boosters,factions, hexMap, hexMapConfig, numberOfPlayers,standardTechTiles,federations,roundScoreTiles,finalScoreTiles } = body.result||{};
      return { 
        props: { 
          advanceTechTiles,
          boosters,
          factions,
          hexMap,
          hexMapConfig,
          numberOfPlayers,
          standardTechTiles,
          federations,
          roundScoreTiles,
          finalScoreTiles,
        }
      };
    } catch (error) {
      console.error(`${error}`);
      return { props: {error} };
    }
}
