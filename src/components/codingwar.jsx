"use client";

import { useState } from "react";
import "../styles/game.css";
import planets from "../assets/astronomy.json";
import { socket } from "src/lib/socket";
import { useEffect } from "react";
import CodingWarLobby from "./codingwar-lobby";

const originalText = planets[0].text;
const originalLines = originalText.split("\n");

export default function CodingWarPage() {
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [roomId, setRoomId] = useState(null);
  
  // Local player state
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentLineInput, setCurrentLineInput] = useState("");
  const [coloredLines, setColoredLines] = useState({});

  // Opponent state
  const [opponentLineIndex, setOpponentLineIndex] = useState(0);
  const [opponentLineInput, setOpponentLineInput] = useState("");
  const [opponentColoredLines, setOpponentColoredLines] = useState({});

  /// SOCKETS
  const [selfId, setSelfId] = useState(null);

  useEffect(() => {
    if (!gameStarted || !roomId) return;

    socket.connect();

    // Store current user ID once connected
    socket.on("connect", () => {
      setSelfId(socket.id);
    });

    // Real-time typing updates from opponent
    socket.on("typingUpdate", (data) => {
      // Only process if it's from the opponent
      if (data.playerId !== socket.id) {
        setOpponentLineIndex(data.lineIndex);
        setOpponentLineInput(data.input);
        
        // Recompute colors for opponent's current line
        const fullLine = originalLines[data.lineIndex] || "";
        const indentLength = fullLine.match(/^[\s]*/)?.[0].length || 0;
        const expectedContent = fullLine.slice(indentLength);
        
        const coloredChars = fullLine.split("").map((char, i) => {
          if (i < indentLength) return "white";
          const charIndex = i - indentLength;
          const isCorrect = data.input[charIndex] === expectedContent[charIndex];
          return isCorrect ? "limegreen" : data.input[charIndex] ? "red" : "white";
        });
        
        setOpponentColoredLines((prev) => ({
          ...prev,
          [data.lineIndex]: coloredChars,
        }));
      }
    });

    // Opponent finishes a line
    socket.on("lineCommitted", (data) => {
      if (data.playerId !== socket.id) {
        const fullLine = originalLines[data.lineIndex] || "";
        const indentLength = fullLine.match(/^[\s]*/)?.[0].length || 0;
        
        const coloredChars = fullLine.split("").map((char, i) => {
          if (i < indentLength) return "white";
          const charIndex = i - indentLength;
          const isCorrect = data.input[charIndex] === char;
          return data.isPerfect ? "gold" : isCorrect ? "limegreen" : "red";
        });
        
        setOpponentColoredLines((prev) => ({
          ...prev,
          [data.lineIndex]: coloredChars,
        }));
        
        // Move opponent to next line
        setOpponentLineIndex((prev) => Math.min(prev + 1, originalLines.length - 1));
        setOpponentLineInput("");
      }
    });

    return () => {
      socket.off("typingUpdate");
      socket.off("lineCommitted");
      socket.off("connect");
    };
  }, [gameStarted, roomId]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    const fullLine = originalLines[currentLineIndex] || "";
    const indentLength = fullLine.match(/^[\s]*/)?.[0].length || 0;
    const expectedContent = fullLine.slice(indentLength);

    // Update current line input state
    setCurrentLineInput(value);

    // Compute colors for current line
    const coloredChars = fullLine.split("").map((char, i) => {
      if (i < indentLength) return "white";
      const charIndex = i - indentLength;
      const isCorrect = value[charIndex] === expectedContent[charIndex];
      return isCorrect ? "limegreen" : value[charIndex] ? "red" : "white";
    });

    setColoredLines((prev) => ({
      ...prev,
      [currentLineIndex]: coloredChars,
    }));

    // Emit full line input to opponent
    if (roomId) {
      socket.emit("typingProgress", {
        roomId,
        lineIndex: currentLineIndex,
        input: value,
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const fullLine = originalLines[currentLineIndex] || "";
      const indentLength = fullLine.match(/^[\s]*/)?.[0].length || 0;
      const expectedContent = fullLine.slice(indentLength);
      const trimmedInput = currentLineInput.trim();

      // Check if line was typed correctly
      const isPerfect = trimmedInput === expectedContent;

      // Emit line commit
      if (roomId) {
        socket.emit("lineCommit", {
          roomId,
          lineIndex: currentLineIndex,
          input: trimmedInput,
          isPerfect,
        });
      }

      // Mark this line as completed
      const coloredChars = fullLine.split("").map((char, i) => {
        if (i < indentLength) return "white";
        const charIndex = i - indentLength;
        const isCorrect = trimmedInput[charIndex] === expectedContent[charIndex];
        return isPerfect ? "gold" : isCorrect ? "limegreen" : "red";
      });

      setColoredLines((prev) => ({
        ...prev,
        [currentLineIndex]: coloredChars,
      }));

      // Move to next line
      const nextLine = Math.min(currentLineIndex + 1, originalLines.length - 1);
      setCurrentLineIndex(nextLine);
      setCurrentLineInput("");
    }
  };

  const handleGameStart = (gameState) => {
    setRoomId(gameState.roomInfo?.id || gameState.id);
    setGameStarted(true);
    console.log("Game started with state:", gameState);
  };

  // Show lobby if game hasn't started
  if (!gameStarted) {
    return <CodingWarLobby onGameStart={handleGameStart} />;
  }

  const renderCode = (lines, lineIndex, lineInput, colors) => {
    return lines.map((line, i) => {
      if (line.trim() === "") {
        return <div key={i} style={{ height: "1.5em" }} />;
      }

      const indentLength = line.match(/^[\s]*/)?.[0].length || 0;
      const content = line.slice(indentLength);

      if (i === lineIndex) {
        // Current line being typed
        return (
          <div key={i} style={{ color: "white" }}>
            <span style={{ opacity: 0.6 }}>
              {line.slice(0, indentLength)}
            </span>
            {content.split("").map((char, idx) => (
              <span
                key={idx}
                style={{
                  color: lineInput[idx] === char ? "limegreen" : lineInput[idx] ? "red" : "white",
                }}
              >
                {char}
              </span>
            ))}
            <span style={{ marginLeft: "2px", animation: "blink 1s infinite", color: "gold" }}>
              |
            </span>
          </div>
        );
      }

      if (colors[i]) {
        // Completed lines
        return (
          <div key={i} style={{ color: "white" }}>
            <span style={{ opacity: 0.6 }}>
              {line.slice(0, indentLength)}
            </span>
            {content.split("").map((char, idx) => (
              <span
                key={idx}
                style={{ color: colors[i][idx + indentLength] }}
              >
                {char}
              </span>
            ))}
          </div>
        );
      }

      // Future lines
      return (
        <div key={i} style={{ color: "rgba(255,255,255,0.5)" }}>
          {line}
        </div>
      );
    });
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", padding: "2rem" }}>
      <main className="game-wrapper">
        <h2>You</h2>
        <div className="editor-shell">
          <pre className="editor-container">
            {renderCode(originalLines, currentLineIndex, currentLineInput, coloredLines)}
          </pre>
        </div>

        <input
          id="inputText"
          autoFocus
          type="text"
          value={currentLineInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type the current line..."
          style={{
            width: "100%",
            marginTop: "1rem",
            padding: "0.5rem",
            backgroundColor: "#1a1a1a",
            color: "white",
            border: "1px solid #333",
            borderRadius: "4px",
          }}
        />
      </main>

      <aside className="game-wrapper">
        <h2>Opponent</h2>
        <div className="editor-shell">
          <pre className="editor-container">
            {renderCode(originalLines, opponentLineIndex, opponentLineInput, opponentColoredLines)}
          </pre>
        </div>
      </aside>
    </div>
  );
}
