import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Socket} from "socket.io-client";
import {useParams} from "react-router";

interface CharArray {
  char: string;
  color: string;
}

function Form({
  socket,
  fetchedText,
}: {
  socket: Socket,
  fetchedText: string,
}) {
  const { roomId, userName } = useParams();
  const [input, setInput] = useState<string>('');
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);

  const words = useMemo(() => {
    const textArray = fetchedText.split(' ');
    return textArray.map((word, index) => {
      if ((textArray.length - 1) !== index) return word.concat(' ')
      return word;
    })
  }, [fetchedText])

  const fullTextWithErrors:CharArray[][] = useMemo(() => words
    .map((word, wordIndex) => word.split('')
        .map((char, charIndex) => {
        let color: string = 'white';
        // Show correct (green) for completed words
        if (wordIndex < currentWordIndex) {
          color = 'green';
        }
        // Highlight mistakes in the current word
        if (wordIndex === currentWordIndex && charIndex < input.length) {
          const firstMistakeIndex = input
            .split('')
            .findIndex((c, i) => c !== word[i]);

          if (firstMistakeIndex === -1 || charIndex < firstMistakeIndex) {
            color = input[charIndex] === char ? 'green' : 'red';
          } else {
            color = 'red';
          }
        }
        return ({
          char,
          color: color,
        })
      })
    ), [input, words])

  const greenChars = useMemo(() => {
    return fullTextWithErrors
      .flat()
      .filter(({color}) => color === 'green')
  }, [fullTextWithErrors])

  useEffect(() => {
    const progress = (greenChars.length / fetchedText.split('').length) * 100;
    socket.emit("progress", {user: userName,room: Number(roomId), progress: Math.ceil(progress)})
  }, [fullTextWithErrors])

  const inputHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (words[currentWordIndex] === value) {
      setInput('');
      setCurrentWordIndex((prev) => prev + 1);
    }
  }, [words, currentWordIndex])

  return (
    <div>
      <h1 style={{
        userSelect: 'none',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '9px',
        lineHeight: '1',
        fontSize: '32px'
      }}>
        {fullTextWithErrors.map((word, index) => {
          return (
            <div key={index}>
              {word.map(({char, color}, charIndex) => (
                <span key={charIndex + input} style={{color}}>{char}</span>)
              )}
            </div>
          )
        })}
      </h1>
      <input
        className="input"
        type="text"
        onInput={inputHandler}
        onPaste={(e) => e.preventDefault()}
        value={input}
        autoFocus={true}
      />
    </div>
  );
}

export default Form;
