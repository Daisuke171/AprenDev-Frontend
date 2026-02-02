"use client";

import { useState, useEffect } from "react";
import { socket } from "src/lib/socket";

export default function CodingWarLobby({ onGameStart }) {
  const [roomId, setRoomId] = useState(null);
  const [connectedPlayers, setConnectedPlayers] = useState([]);
  const [selfId, setSelfId] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [otherPlayerReady, setOtherPlayerReady] = useState(false);
  const [showRoomInput, setShowRoomInput] = useState(false);
  const [joinRoomInput, setJoinRoomInput] = useState("");
  const [gameState, setGameState] = useState("waiting"); // waiting, ready, playing

  useEffect(() => {
    socket.connect();
    console.log('🔵 [Lobby] Socket connecting...');

    // Store self ID
    socket.on("connect", () => {
      setSelfId(socket.id);
      console.log('✅ [Lobby] Connected as:', socket.id);
    });

    // Room created
    socket.on("roomCreated", (data) => {
      console.log('✅ [Lobby] roomCreated event received:', data);
      setRoomId(data.roomId);
      console.log("Room created:", data.roomId);
    });

    // Join room success
    socket.on("joinRoomSuccess", (data) => {
      console.log('✅ [Lobby] joinRoomSuccess event received:', data);
      setRoomId(data.roomId);
      console.log("Joined room:", data.roomId);
    });

    // Game state updates (tracks players and ready status)
    socket.on("gameState", (state) => {
      console.log("📊 [Lobby] Game state received:", state);
      if (state.players && Array.isArray(state.players)) {
        setConnectedPlayers(state.players);
      }

      // Check ready status
      if (state.ready) {
        const myReady = state.ready[socket.id] || false;
        setIsReady(myReady);

        // Check if other player is ready
        const otherPlayerId = state.players?.find((id) => id !== socket.id);
        if (otherPlayerId) {
          setOtherPlayerReady(state.ready[otherPlayerId] || false);
        }
      }

      // If both players ready and game is in PlayingState, transition to game
      if (
        state.state === "PlayingState" &&
        state.players?.length === 2 &&
        state.ready &&
        Object.values(state.ready).every((r) => r === true)
      ) {
        console.log('🎮 [Lobby] Game starting!');
        setGameState("playing");
        onGameStart(state);
      }
    });

    // Error handlers
    socket.on("joinRoomError", (data) => {
      console.error('❌ [Lobby] Join room error:', data);
      alert(data.message);
    });

    socket.on("isPrivate", (data) => {
      console.log('🔒 [Lobby] Room is private:', data);
      alert(data.message);
    });

    return () => {
      socket.off("connect");
      socket.off("roomCreated");
      socket.off("joinRoomSuccess");
      socket.off("gameState");
      socket.off("joinRoomError");
      socket.off("isPrivate");
    };
  }, [onGameStart]);

  const handleCreateRoom = () => {
    console.log('🔵 [Lobby] Creating room...');
    socket.emit("createRoom", {
      roomName: "Test Room",
      isPrivate: false,
    });
    console.log('📤 [Lobby] createRoom event emitted');
  };

  const handleJoinRoom = () => {
    if (!joinRoomInput.trim()) {
      alert("Please enter a room ID");
      return;
    }
    console.log('🔵 [Lobby] Joining room:', joinRoomInput);
    socket.emit("joinRoom", {
      roomId: joinRoomInput,
    });
    console.log('📤 [Lobby] joinRoom event emitted');
  };

  const handleReady = () => {
    if (!roomId) return;

    console.log('🔵 [Lobby] Setting ready:', !isReady);
    socket.emit("confirmReady", {
      roomId,
      ready: !isReady,
    });
    console.log('📤 [Lobby] confirmReady event emitted');

    // Request game state to confirm
    socket.emit("requestGameState", { roomId });
  };

  if (gameState === "playing") {
    return null; // Parent will show game component
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0a0e27",
        color: "white",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "monospace",
      }}
    >
      <h1 style={{ marginBottom: "3rem", fontSize: "2.5rem" }}>Coding War</h1>

      {!roomId ? (
        <div
          style={{
            display: "flex",
            gap: "2rem",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <button
            onClick={handleCreateRoom}
            style={{
              padding: "1rem 2rem",
              fontSize: "1.1rem",
              backgroundColor: "#6366f1",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = "#4f46e5")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "#6366f1")
            }
          >
            Create Room
          </button>

          <button
            onClick={() => setShowRoomInput(!showRoomInput)}
            style={{
              padding: "1rem 2rem",
              fontSize: "1.1rem",
              backgroundColor: "#8b5cf6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = "#7c3aed")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "#8b5cf6")
            }
          >
            Join Room
          </button>

          {showRoomInput && (
            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              <input
                type="text"
                value={joinRoomInput}
                onChange={(e) => setJoinRoomInput(e.target.value)}
                placeholder="Enter room ID"
                onKeyPress={(e) => e.key === "Enter" && handleJoinRoom()}
                style={{
                  padding: "0.75rem",
                  backgroundColor: "#1a1a2e",
                  color: "white",
                  border: "1px solid #6366f1",
                  borderRadius: "4px",
                  fontSize: "1rem",
                }}
              />
              <button
                onClick={handleJoinRoom}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#8b5cf6",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Join
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "#1a1a2e",
            padding: "2rem",
            borderRadius: "12px",
            border: "1px solid #6366f1",
            minWidth: "400px",
          }}
        >
          <div style={{ marginBottom: "2rem" }}>
            <p style={{ marginBottom: "0.5rem", opacity: 0.8 }}>Room ID:</p>
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                alignItems: "center",
              }}
            >
              <p
                style={{
                  fontSize: "1.2rem",
                  color: "#6366f1",
                  wordBreak: "break-all",
                  margin: 0,
                  backgroundColor: "#0a0e27",
                  padding: "0.75rem",
                  borderRadius: "4px",
                  border: "1px solid #6366f1",
                  flex: 1,
                  fontWeight: "bold",
                }}
              >
                {roomId}
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(roomId);
                  alert("Room ID copied!");
                }}
                style={{
                  padding: "0.75rem 1rem",
                  backgroundColor: "#6366f1",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Copy ID
              </button>
            </div>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <p style={{ marginBottom: "1rem", opacity: 0.8 }}>
              Connected Players: {connectedPlayers.length}/2
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {connectedPlayers.map((playerId, idx) => (
                <div
                  key={playerId}
                  style={{
                    padding: "0.75rem",
                    backgroundColor: "#2a2a3e",
                    borderRadius: "4px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>
                    Player {idx + 1} {playerId === selfId && "(You)"}
                  </span>
                  <span
                    style={{
                      color:
                        idx === 0
                          ? isReady
                            ? "#22c55e"
                            : "#ef4444"
                          : otherPlayerReady
                            ? "#22c55e"
                            : "#ef4444",
                      fontWeight: "bold",
                    }}
                  >
                    {idx === 0
                      ? isReady
                        ? "✓ Ready"
                        : "✗ Not Ready"
                      : otherPlayerReady
                        ? "✓ Ready"
                        : "✗ Waiting"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {connectedPlayers.length === 2 ? (
            <button
              onClick={handleReady}
              style={{
                width: "100%",
                padding: "1rem",
                fontSize: "1.1rem",
                backgroundColor: isReady ? "#22c55e" : "#6366f1",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = isReady
                  ? "#16a34a"
                  : "#4f46e5")
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = isReady
                  ? "#22c55e"
                  : "#6366f1")
              }
            >
              {isReady ? "Cancel Ready" : "Ready to Play"}
            </button>
          ) : (
            <div
              style={{
                width: "100%",
                padding: "1rem",
                backgroundColor: "#1a1a2e",
                borderRadius: "8px",
                textAlign: "center",
                opacity: 0.6,
              }}
            >
              Waiting for opponent...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
