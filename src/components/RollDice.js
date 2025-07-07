import React, { useState, useCallback } from 'react';
import './RollDice.css';
import Die from './Die';

// Utility functions outside the component
function shuffle(array) {
  let arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function generateUniqueNumbers() {
  return shuffle([1, 2, 3, 4, 5, 6]);
}

const RollDice = ({ sides = ['one', 'two', 'three', 'four', 'five', 'six'] }) => {
  const [die, setDie] = useState('one');
  const [rolling, setRolling] = useState(false);
  const [numbers, setNumbers] = useState(generateUniqueNumbers());
  const [selectedCard, setSelectedCard] = useState(null);
  const [guessResult, setGuessResult] = useState('');
  const [canGuess, setCanGuess] = useState(false);
  const [numbersRevealed, setNumbersRevealed] = useState(false);

  
  const dieFaceToNumber = (face) => {
    const mapping = {
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
    };
    return mapping[face];
  };

  const roll = useCallback(() => {
    setRolling(true);
    setTimeout(() => {
      const newDie = sides[Math.floor(Math.random() * sides.length)];
      setDie(newDie);
      setRolling(false);
      setNumbers(generateUniqueNumbers());
      setSelectedCard(null);
      setGuessResult('');
      setCanGuess(true);
      setNumbersRevealed(false);
    }, 1000);
  }, [sides]);

  const handleCardClick = useCallback((idx) => {
    if (!canGuess || rolling) return;
    setSelectedCard(idx);
    const cardNumber = numbers[idx];
    const dieNumber = dieFaceToNumber(die);
    if (cardNumber === dieNumber) {
      setGuessResult('The guess is correct');
    } else {
      setGuessResult('The guess is incorrect');
    }
    setCanGuess(false); // Only allow one guess per roll
    setNumbersRevealed(true); // Reveal all numbers after a guess
  }, [canGuess, rolling, numbers, die]);

  return (
    <>
      <div className='RollDice'>
        <div className='RollDice-container'>
          <Die face={die} rolling={rolling} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0' }}>
          <button
            className={rolling ? 'RollDice-rolling' : ''}
            disabled={rolling}
            onClick={roll}
            style={{ fontSize: '1.2rem', padding: '12px 32px', borderRadius: '8px', fontWeight: 600, boxShadow: '0 2px 8px rgba(0,0,0,0.10)', background: '#43cea2', color: '#fff', border: 'none', cursor: rolling ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
          >
            {rolling ? 'Rolling' : 'Roll Dice!'}
          </button>
        </div>
      </div>
      <div className="card" style={{ cursor: canGuess ? 'pointer' : 'default', marginTop: 20 }}>
        {numbers.map((num, idx) => (
          <div
            className={`wrapper${selectedCard === idx ? ' selected' : ''}`}
            key={idx}
            onClick={() => handleCardClick(idx)}
            tabIndex={0}
            aria-label={numbersRevealed ? `Card number ${num}` : 'Click me'}
            style={{
              pointerEvents: canGuess ? 'auto' : 'none',
              opacity: canGuess || selectedCard === idx ? 1 : 0.6,
              animation: numbersRevealed ? 'fadeInNum 0.5s' : 'none',
            }}
          >
            <h2>{numbersRevealed ? num : 'click me'}</h2>
          </div>
        ))}
      </div>
      {guessResult && (
        <div className="guess-result">
          {guessResult === 'The guess is correct' ? '🎉 The guess is correct!' : '❌ The guess is incorrect!'}
        </div>
      )}
     
    </>
  );
};

export default RollDice;