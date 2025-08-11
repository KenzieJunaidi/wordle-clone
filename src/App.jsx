import { useState, useEffect } from 'react'
import { motion } from 'framer-motion';
import axios from 'axios';
import './App.css'
import { Header } from './components/Header';
import { Line } from './components/Line';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [answer, setAnswer] = useState("");
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState("");
  const [isFinish, setIsFinish] = useState(false);
  const [gameStatus, setGameStatus] = useState("");

  const WORD_LENGTH = 5;

  // Fetch API
  const fetchAPI = () => {
    axios.get("https://random-words-api.kushcreates.com/api?language=en&category=wordle&length=5&type=uppercase")
    .then((res) => {
      const wordBank = res.data;
      const randomIndex = Math.floor(Math.random() * wordBank.length);
      setAnswer(wordBank[randomIndex].word);
    })
    .catch((error) => {
      console.error("Error: ", error);
    })
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

  useEffect(() => {
    fetchAPI();
    setIsLoaded(true);
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
  }, [currentGuess]);

  return (
    <motion.div className={`app ${isLoaded ? "loaded" : ""}`}>
      <Header />
      {answer}
      <motion.div className="board">
        {guesses.map((items, index) => {
          const currentIndex = index === guesses.findIndex(val => val == null);

          return (
            <Line key = {index} guess = {currentIndex ? currentGuess : items ?? ""} isCheck = {!currentIndex && items != null} answer = {answer}/>
          )
        })}
      </motion.div>
      <motion.div className={`notification ${isFinish? "show" : ""}`} />
    </motion.div>
  )
}

export default App
