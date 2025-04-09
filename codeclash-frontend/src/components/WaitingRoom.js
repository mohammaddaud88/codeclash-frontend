import { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { useParams, useNavigate } from "react-router-dom";
import Navbar2 from "./Navbar2";

const SOCKET_URL = "ws://localhost:8788/ws";

const WaitingRoom = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [host, setHost] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isLoading, setIsLoading] = useState(true);
  const [roomStatus, setRoomStatus] = useState("waiting"); // "waiting", "started", "ended"
  const stompClientRef = useRef(null);

  // WebSocket Connection
  useEffect(() => {
    if (!roomCode || stompClientRef.current) return;

    stompClientRef.current = new Client({
      brokerURL: SOCKET_URL,
      reconnectDelay: 5000,
      debug: (msg) => console.log("🐛 STOMP Debug:", msg),
      onConnect: () => {
        console.log("✅ Connected to WebSocket");

        const topic = `/topic/room/${roomCode}`;
        console.log(`📡 Subscribing to: ${topic}`);

        // First subscribe to room updates
        stompClientRef.current.subscribe(topic, (message) => {
          console.log(`🔔 Received WebSocket message:`, message.body);
          try {
            const updatedRoom = JSON.parse(message.body);
            console.log("✅ Parsed WebSocket Data:", updatedRoom);

            // Update room state
            setHost(updatedRoom.host || "");
            
            // Handle players from Redis LinkedHashSet format
            if (updatedRoom.players && updatedRoom.players["@class"] === "java.util.LinkedHashSet") {
              setPlayers(updatedRoom.players[1] || []);
            } else if (Array.isArray(updatedRoom.players)) {
              setPlayers(updatedRoom.players);
            }
            
            setRoomStatus(updatedRoom.status || "waiting");
            if (updatedRoom.timer !== undefined) setTimeLeft(updatedRoom.timer);
            setIsLoading(false);
          } catch (error) {
            console.error("❌ Error parsing WebSocket message:", error);
          }
        });

        // Then publish initial room creation message
        const username = localStorage.getItem("username") || "Host";
        stompClientRef.current.publish({
          destination: "/app/room/create",
          body: JSON.stringify({ 
            roomCode, 
            host: username,
            players: [username] // Initialize players array with host
          }),
        });
      },
      onStompError: (frame) => console.error("❌ WebSocket error:", frame),
      onWebSocketClose: () => console.log("🔴 WebSocket disconnected"),
    });

    stompClientRef.current.activate();

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
      }
    };
  }, [roomCode]);

  // Timer Logic
  useEffect(() => {
    if (timeLeft <= 0 && roomStatus === "waiting") {
      navigate("/");
      return;
    }
    if (roomStatus === "waiting") {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, roomStatus, navigate]);

  // Handle Start Room
  const handleStart = () => {
    if (stompClientRef.current) {
      stompClientRef.current.publish({
        destination: "/app/room/start",
        body: JSON.stringify({ roomCode, status: "started" }),
      });
      setRoomStatus("started");
    }
  };

  // Handle End Room
  const handleEnd = () => {
    if (stompClientRef.current) {
      stompClientRef.current.publish({
        destination: "/app/room/end",
        body: JSON.stringify({ roomCode, status: "ended" }),
      });
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-50">
      <Navbar2 />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-8 max-w-2xl mx-auto border border-indigo-100/50 transition-all duration-300 hover:shadow-indigo-200/50">
          {/* Header */}
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 text-center mb-3 animate-fade-in">
            CodeClash Arena
          </h1>
          <div className="flex justify-center items-center gap-4 mb-8">
            <span className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full border border-indigo-100 shadow-sm">
              Room Code: <span className="font-bold text-indigo-600 ml-1">{roomCode}</span>
            </span>
          </div>

          {/* Timer */}
          {roomStatus === "waiting" && (
            <div className="text-center mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100 shadow-inner animate-pulse-slow">
              <p className="text-lg text-gray-700 flex items-center justify-center gap-3">
                <span className="animate-spin-slow text-2xl">⏳</span>
                Battle begins in{" "}
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 tabular-nums text-xl">
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                </span>
              </p>
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="w-16 h-16 border-4 border-transparent border-b-purple-500 rounded-full animate-spin absolute top-0 animate-spin-slow opacity-70"></div>
              </div>
              <p className="mt-6 text-gray-600 animate-pulse font-medium">Gathering warriors...</p>
            </div>
          ) : (
            <>
              {/* Host Info */}
              <div className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100 shadow-inner">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                  <span className="text-2xl">👑</span>
                  Battle Master: <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 font-bold">{host || "N/A"}</span>
                </h2>
              </div>

              {/* Players List */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-3">
                  <span className="text-2xl">👥</span>
                  Warriors ({players.length}):
                </h3>
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-1">
                  <ul className="space-y-2 max-h-60 overflow-y-auto bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-inner">
                    {players.length > 0 ? (
                      players.map((player, index) => (
                        <li
                          key={index}
                          className="text-gray-700 flex items-center gap-3 p-2 hover:bg-indigo-50/50 rounded-lg transition-all duration-200"
                        >
                          <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
                          <span className="font-medium">
                            {player === host ? (
                              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                {player} <span className="text-sm">(Battle Master)</span>
                              </span>
                            ) : player}
                          </span>
                        </li>
                      ))
                    ) : (
                      <p className="text-gray-500 italic text-center py-4">Awaiting brave warriors...</p>
                    )}
                  </ul>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-center gap-4 mt-12">
                {roomStatus === "waiting" && (
                  <button
                    onClick={handleStart}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2"
                  >
                    <span>⚔️</span> Begin Battle
                  </button>
                )}
                <button
                  onClick={handleEnd}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  <span>❌</span> End Battle
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;