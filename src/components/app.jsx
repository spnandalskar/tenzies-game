import React from "react";
import Die from "./die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import winningSound from "../assets/winningSound.wav";

export default function App() {
  const [dice, setDice] = React.useState(() => generateAllNewDice());
  const [playSound, setPlaySound] = React.useState(false);
  const audioRef = React.useRef(new Audio(winningSound));
  const buttonRef = React.useRef(null);

  const gameWon =
    dice.every((die) => die.isHeld) &&
    dice.every((die) => die.value === dice[0].value);

  function generateAllNewDice() {
    return new Array(10).fill(0).map(() => ({
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    }));
  }

  function rollDice() {
    if (!gameWon) {
      setDice((prevDice) =>
        prevDice.map((dieObj) =>
          dieObj.isHeld
            ? dieObj
            : { ...dieObj, value: Math.ceil(Math.random() * 6) }
        )
      );
    } else {
      setDice(generateAllNewDice());
      setPlaySound(false);
    }
  }

  if (gameWon && !playSound) {
    setPlaySound(true);
    audioRef.current.currentTime = 0; //Reset sound
    audioRef.current.play(); // Play sound immediately
  }

  function hold(id) {
    setDice((prevDice) =>
      prevDice.map((dieObj) =>
        dieObj.id == id ? { ...dieObj, isHeld: !dieObj.isHeld } : dieObj
      )
    );
  }

  React.useEffect(() => {
    if (gameWon) {
      buttonRef.current.focus();
    }
  }, [gameWon]);

  const dieElements = dice.map((dieObj) => (
    <Die
      key={dieObj.id}
      id={dieObj.id}
      value={dieObj.value}
      isHeld={dieObj.isHeld}
      hold={() => hold(dieObj.id)}
    />
  ));

  return (
    <main>
      {gameWon && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={200}
          gravity={2.5}
          friction={0.99}
          wind={0}
          opacity={1}
          recycle={false}
          tweenDuration={1000}
          // run={false} to pause the confetti
        />
      )}
      <div>
        {gameWon && (
          <p className="sr-only">
            Congratulations! You won! Press &ldquo;New Game&rdquo; to start
            again.
          </p>
        )}
      </div>
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{dieElements}</div>
      <button className="roll-dice" onClick={rollDice} ref={buttonRef}>
        {gameWon ? "New Game" : "Roll"}
      </button>
    </main>
  );
}
