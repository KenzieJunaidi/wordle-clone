import { motion } from 'framer-motion';

export const Line = (props) => {

    const WORD_LENGTH = 5;
    const tiles = [];

    for(let i=0; i<WORD_LENGTH; i++){
        const character = (props.guess[i] || "");

        // Finalized Answer
        if(props.isCheck){
            let className = "tile";
            if(character === props.answer[i]){
                className += " correct";
            }
            else if(props.answer.includes(character)){
                className += " close";
            }
            else{
                className += " incorrect";
            }
            tiles.push(
                <div key={i} className={className}>{character}</div>
            )
        }

        // Current Guess
        else{
            tiles.push(
                <div key={i} className={`tile ${character === "" ? "" : "selected"}`}>{character}</div>
            )
        }
    }

    return (
        <motion.div className="tile-wrapper">
            {tiles}
        </motion.div>
    );
}