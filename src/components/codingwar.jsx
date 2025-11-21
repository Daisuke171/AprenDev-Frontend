'use client'

import { useState } from "react";
import code from "../assets/codes.json";
import planets from "../assets/astronomy.json";

const originalText = planets[0].text;

export default function CodingWarPage() {
  const [cursorPosition, setCursorPosition] = useState(0);
  const [newBasePosition, setnewBasePosition] = useState(0);
  const [typedText, setTypedText] = useState(originalText.split(""));

  const handleKeyDown = (e) => {
    const key = e.key;

    // Ignore control keys
    if (key.length > 1 && key != "Enter" && key != "Backspace") return;

    // Change level
    if (cursorPosition == originalText.length){
      // change level and reset cursor position
      return;
    }

    console.log(key)

    if (key == "Enter"){
      let nextIndex = typedText.indexOf("\n", newBasePosition + 1);

      // No more newlines → go to end
      if (nextIndex === -1) {
        nextIndex = code.length - 1;
        return;
      }

      // Handle multiple empty lines
      while (originalText[nextIndex + 1] === "\n") {
        nextIndex++;
      }
      if(originalText[nextIndex] == "\n" && originalText[nextIndex+1] == " "){
        let whitespacePos = nextIndex+1;
        while(originalText[whitespacePos] == " "){
          nextIndex++;
          whitespacePos++;
        }
      }

      const newPos = nextIndex + 1;

      setCursorPosition(newPos);
      setnewBasePosition(newPos);
      return;
    }

    if (key == "Backspace" && cursorPosition>=newBasePosition){
      if(cursorPosition==newBasePosition){
        resetColor(); 
        return;
      }

      setCursorPosition(cursorPosition-1);
      resetColor(cursorPosition-1);
      return;
    }

    // Stop typing when hittin endl
    if(originalText[cursorPosition] === '\n'){
      return;
    }

    if (key === originalText[cursorPosition]) {
      const updated = [...typedText];
      updated[cursorPosition] = (
        <span style={{ color: "limegreen" }} key={cursorPosition}>
          {key}
        </span>
      );

      setTypedText(updated);
      setCursorPosition(cursorPosition + 1);
    }
    else{
      const updated = [...typedText];
      updated[cursorPosition] = (
        <span style={{ color: "red" }} key={cursorPosition}>
          {originalText[cursorPosition]}
        </span>
      );

      setTypedText(updated);
      setCursorPosition(cursorPosition + 1);
    }
    
  };

  const resetColor = (i) => {
    const updated = [...typedText];
    updated[i] = originalText[i];
    setTypedText(updated);
  }

  return (
    <main>
      <h1>Prototype</h1>
      <p>This is the page for the typing game</p>

      <pre id="textViewer">{typedText}</pre>
      <input 
        id="inputText"
        autoFocus
        type="text" 
        onKeyDown={(e) => handleKeyDown(e)}
      ></input>
      <div>position: {cursorPosition}</div>
    </main>
  );
}