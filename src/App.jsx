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
  const [isFinish, setIsFinish] = useState(false);
  const [gameStatus, setGameStatus] = useState("");
  const [notification, setNotification] = useState(false);

  const WORD_LENGTH = 5;

  // Randomize Words
  const randomizeWord = () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    setAnswer(words[randomIndex]);
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

  const handleRestart = () => {
    setGameStatus("");
    setCurrentGuess("");
    setIsFinish(false);
    setGuesses(Array(6).fill(null));
    randomizeWord();
  };

  useEffect(() => {
    setIsLoaded(true);
    randomizeWord();
  }, []);

  useEffect(() => {
    // Keydown Event
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

          if(currentGuess === answer){
            setIsFinish(true);  
            setGameStatus("Win");
          }

          if(!tempGuesses.some(val => val === null)){
            setIsFinish(true);
            setGameStatus("Lose");
          }
        }
        else{
          setNotification(true);
          setTimeout(() => {
            setNotification(false);
          }, 3000);
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

  return (
    <motion.div className={`app ${isLoaded ? "loaded" : ""}`}>
      <Header />

      {notification ?
        <motion.div className={`message-wrapper show`}>
          <motion.div className="message">
            <p className="message-text">Invalid Word</p>
          </motion.div>
        </motion.div>
      :
        <motion.div className={`message-wrapper ${isFinish ? "show" : ""}`}>
          <motion.div className="message">
            <p className="message-text">{gameStatus === 'Win' ? "Awesome!" : answer}</p>
          </motion.div>
        </motion.div>
      }

      <motion.div className="board">
        {guesses.map((items, index) => {
          const currentIndex = index === guesses.findIndex(val => val == null);

          return (
            <Line key = {index} guess = {currentIndex ? currentGuess : items ?? ""} isCheck = {!currentIndex && items != null} answer = {answer}/>
          )
        })}
      </motion.div>
      <motion.div className={`notification-wrapper ${isFinish? "show" : ""}`}>
        <motion.div className="notification">
          <motion.div className="stats">
            <h3>STATISTICS</h3>
            <motion.div className="stats-card-wrapper">
              <motion.div className="stats-card">
                <h5>0</h5>
                <p>Played</p>
              </motion.div>
              <motion.div className="stats-card">
                <h5>0</h5>
                <p>Win %</p>
              </motion.div>
              <motion.div className="stats-card">
                <h5>0</h5>
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
