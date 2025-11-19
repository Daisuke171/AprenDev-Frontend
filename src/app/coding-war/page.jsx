'use client'

import { useState } from "react";
import code from "public/codes.json";


export default function CodingWarPage() {
  const originalText = code[0].code;
  console.log(originalText)
  const [cursorPosition, setCursorPosition] = useState(0);
  const [typedText, setTypedText] = useState(originalText.split(""));

  const handleKeyDown = (e) => {
    const key = e.key;

    // Ignore control keys
    if (key.length > 1 && key != "Enter" && key != "Backspace") return;

    console.log(key)

    if (key == "Enter"){
      const endl = typedText.findIndex(char => char === "\n") + 1;
      setCursorPosition(endl);
      return;
    }
    if (key == "Backspace" && cursorPosition>=0){
      if(cursorPosition==0){
        resetColor(); 
        return;
      }

      setCursorPosition(cursorPosition-1);
      resetColor(cursorPosition-1);
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
      <h1>Coding War</h1>
      <p>This is the coding war page</p>

      <pre id="textViewer">{typedText}</pre>
      <input 
        type="text" 
        onKeyDown={(e) => handleKeyDown(e)}
      ></input>
      <div>{cursorPosition}</div>
    </main>
  );
}