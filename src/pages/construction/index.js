import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import httpCli from "src/middlewares/httpCli";
import styles from "./styles/index.module.scss";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
  countries,
} from "unique-names-generator";
import uniqueRandomArray from "unique-random-array";
import { withCookiesContext } from 'src/middlewares/cookies';

function Construction(props) {
  const [players, setPlayers] = useState([
    createFunnyName(),
    createFunnyName(),
  ]);
  const [maxSeats, setMaxSeats] = useState(4);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const router = useRouter();

  function createFunnyName() {
    return uniqueNamesGenerator({
      dictionaries: [
        uniqueRandomArray([adjectives, colors, countries])(),
        animals,
      ],
      style: "capital",
      separator: " ",
      length: 2,
    });
  }
  function handleUpdatePlayerName(val, index) {
    players[index] = val;
    return setPlayers([...players]);
  }

  function addSeat() {
    if (players.length < maxSeats) {
      return setPlayers([...players, createFunnyName()]);
    }
  }
  function removeSeatAt(index) {
    if (players.length > 1) {
      return removePlayersAtIndex(index);
    }
  }
  function removePlayersAtIndex(index) {
    return setPlayers([
      ...players.filter((p, i) => {
        return i !== index;
      }),
    ]);
  }
  async function handleSubmit(formData) {
    try {
      if (formIsDisabled()) {
        return false;
      }
      submitBegin();
      
      const { body } = await httpCli({
        url: "/api/generate",
        method: 'POST',
        body: {
          players
        }
      }).catch((error) => {
        setSubmitting(false);
        return setSubmitError(error);
      })
      const { id } = body;
      router.push("/result/" + id);
      return {
        props: {
          factions,
          hexMap,
        },
      };
    } catch (error) {
      return setSubmitting(false);
    }
  }
  function formIsDisabled() {
    return submitting;
  }
  function playerIsMaximum() {
    return players.length >= maxSeats;
  }
  function playerIsMinimum() {
    return players.length < 2;
  }
  function clearError() {
    setSubmitError('');
  }
  function submitBegin() {
    clearError();
    setSubmitting(true);
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Gen Gaia</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Mono&display=swap"
          rel="stylesheet"
        ></link>
      </Head>

      <main className={styles.main}>
        <p className={styles.title}>~ i feel it coming ~</p>
      </main>

      <footer className={styles.footer}>
        <a href="//fb.com/oskee121" target="_blank" rel="noopener noreferrer">
          Powered by oskee121
        </a>
      </footer>
    </div>
  );
}

export default Construction;
