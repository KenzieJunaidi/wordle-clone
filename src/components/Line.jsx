import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const Line = (props) => {

    const rowVariants = {
        initial: {},
        animate: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const tileVariants = {
        initial: {
            rotateX: 0
        },
        animate: (i) => ({
            rotateX: [0, 90, 0],
            backgroundColor: [
                "#fff",
                "#fff",
                "var(--final-bg)"
            ],
            color: [
                "#111",
                "#111",
                "var(--text-color-final)"
            ],
            transition: {
                rotateX: { duration: 0.6, ease: "easeInOut" },
                backgroundColor: { duration: 0.6, ease: "easeInOut", times: [0, 0.5, 1] },
                color: { duration: 0.6, ease: "easeInOut", times: [0, 0.5, 1] },
                delay: i * 0.2
            }
        })
    };

    const WORD_LENGTH = 5;
    const tiles = [];

    for(let i=0; i<WORD_LENGTH; i++){
        const character = (props.guess[i] || "");
        let className = "tile";

        if(props.isCheck){
            if(character === props.answer[i]){
                className += " correct";
            }
            else if(props.answer.includes(character)){
                className += " close";
            }
            else{
                className += " incorrect";
            }
        }

        else {
            if(character) {
                className += " selected";
            }

            if(props.index === props.currIndex && props.shake){
                className += " shake";
            }
        }

        tiles.push(
            <motion.div
                key = {`${i}-${props.guess[i]}`}
                className = {className}
                variants = {tileVariants}
                custom = {i}
            >
                {character}
            </motion.div>
        );
    }

    return (
        <motion.div className="tile-wrapper" variants = {rowVariants} initial = "initial" animate = {props.index === props.currIndex - 1 ? "animate" : "initial"}>
            {tiles}
        </motion.div>
    );
}