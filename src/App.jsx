import { useState, useEffect } from 'react'
import { motion } from 'framer-motion';
import axios from 'axios';
import './App.css'
import { Header } from './components/Header';
import { Line } from './components/Line';
import words from './assets/words/words.json';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [answer, setAnswer] = useState("");
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState("");

  // Status Const
  const [isFinish, setIsFinish] = useState(false);
  const [gameStatus, setGameStatus] = useState("");

  // Stats Const
  const [gamesPlayed, setGamesPlayed] = useState(1);
  const [win, setWin] = useState(0);
  const [winrate, setWinrate] = useState(0);
  const [currStreak, setCurrStreak] = useState(0);

  // Effects Const
  const [shake, setShake] = useState(false);

  const WORD_LENGTH = 5;

  // Randomize Words
  const randomizeWord = () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    setAnswer(words[randomIndex]);
    console.log(words[randomIndex]);
  };

  // Validate Answer
  const isValid = async () => {
    try {
      await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${currentGuess}`)
      return true;
    }
    catch {
      return false;
    }
  }

  // Play Again Function
  const handleRestart = () => {
    setGameStatus("");
    setCurrentGuess("");
    setIsFinish(false);
    setGuesses(Array(6).fill(null));
    randomizeWord();
    setGamesPlayed(prevGames => prevGames + 1);
  };

  // First Load useEffect
  useEffect(() => {
    setIsLoaded(true);
    randomizeWord();
  }, []);

  // Keydown Event
  useEffect(() => {
    const handleKeydown = async (event) => {
      if(isFinish){
        return;
      }

      if(event.key === "Backspace"){
        setCurrentGuess((prev) => prev.slice(0, -1));
      }

      if(event.key === "Enter"){
        if(currentGuess.length !== 5){
          return;
        }

        if(await isValid()){
          const tempGuesses = [...guesses];
          tempGuesses[guesses.findIndex(val => val == null)] = currentGuess;

          setGuesses(tempGuesses);
          setCurrentGuess("");

          // Win Condition
          if(currentGuess === answer){
            setIsFinish(true);  
            setGameStatus("Win");

            setCurrStreak(prevStreak => prevStreak + 1);
            setWin(prevWin => prevWin + 1);
          }

          // Lose Condition
          if(!tempGuesses.some(val => val === null)){
            setIsFinish(true);
            setGameStatus("Lose");

            setCurrStreak(0);
          }
        }

        else{

          setShake(true);
          setTimeout(() => {
            setShake(false);
          }, 400)
        }
      }

      if(currentGuess.length >= 5){
        return;
      }

      else if(/^[a-zA-Z]$/.test(event.key)){
        setCurrentGuess(currentGuess + event.key.toUpperCase());
      }
    };

    window.addEventListener("keydown", handleKeydown);
    
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    }
  }, [currentGuess, answer, guesses]);

  // Calculate Winrate
  useEffect(() => {
    setWinrate(Math.floor(win/gamesPlayed * 100));
  }, [win, gamesPlayed])

  return (
    <motion.div className={`app ${isLoaded ? "loaded" : ""}`}>
      <Header />

      <motion.div className={`message-wrapper ${isFinish ? "show" : ""}`}>
        <motion.div className="message">
          <p className="message-text">{gameStatus === 'Win' ? "Awesome!" : answer}</p>
        </motion.div>
      </motion.div>

      <motion.div className="board">
        {guesses.map((items, index) => {
          const isCurrIndex = index === guesses.findIndex(val => val == null);
          const currIndex = guesses.findIndex(val => val == null);

          return (
            <Line key = {index} index = {index} currIndex = { currIndex } guess = {isCurrIndex ? currentGuess : items ?? ""} isCheck = {!isCurrIndex && items != null} answer = {answer}
              shake = {shake}
            />
          )
        })}
      </motion.div>
      <motion.div className={`notification-wrapper ${isFinish? "show" : ""}`}>
        <motion.div className="notification">
          <motion.div className="stats">
            <h3>STATISTICS</h3>
            <motion.div className="stats-card-wrapper">
              <motion.div className="stats-card">
                <h5>{gamesPlayed}</h5>
                <p>Played</p>
              </motion.div>
              <motion.div className="stats-card">
                <h5>{winrate}</h5>
                <p>Win %</p>
              </motion.div>
              <motion.div className="stats-card">
                <h5>{currStreak}</h5>
                <p>Current Streak</p>
              </motion.div>
            </motion.div>
          </motion.div>
          <button className="restart-button" onClick={handleRestart}>PLAY AGAIN!</button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default App
