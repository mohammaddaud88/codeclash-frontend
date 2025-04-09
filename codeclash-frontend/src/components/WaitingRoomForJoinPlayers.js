import { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { useNavigate } from "react-router-dom";
import Navbar2 from "./Navbar2";
import "./WaitingRoom.css";

const SOCKET_URL = "ws://localhost:8788/ws";

const WaitingRoomJoins = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const roomCode = queryParams.get("roomCode");

  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [host, setHost] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const [roomStatus, setRoomStatus] = useState("waiting");

  const stompClientRef = useRef(null);

  useEffect(() => {
    if (!roomCode) {
      console.error("❌ Room code is missing! Cannot subscribe.");
      return;
    }

    if (!stompClientRef.current) {
      stompClientRef.current = new Client({
        brokerURL: SOCKET_URL,
        reconnectDelay: 5000,
        onConnect: () => {
          try {
            console.log("✅ Connected to WebSocket", SOCKET_URL);
            const topic = `/topic/room/${roomCode}`;
            console.log(`✅ Subscribing to: ${topic}`);

            stompClientRef.current.subscribe(topic, (message) => {
              try {
                const updatedRoom = JSON.parse(message.body);
                console.log("🔹 Parsed Room Data:", updatedRoom);

                setHost(updatedRoom.host || "");

                if (updatedRoom.players) {
                  if (updatedRoom.players["@class"] === "java.util.LinkedHashSet") {
                    const playersList = updatedRoom.players[1] || [];
                    setPlayers(playersList);
                  } else if (Array.isArray(updatedRoom.players)) {
                    setPlayers(updatedRoom.players);
                  }
                }

                setRoomStatus(updatedRoom.status || "waiting");
                if (updatedRoom.timer !== undefined) setTimeLeft(updatedRoom.timer);
                setIsLoading(false);
              } catch (error) {
                console.error("❌ Error parsing message:", error);
              }
            });

            const username = localStorage.getItem("username") || "Player";
            const joinMessage = { roomCode, player: username };

            stompClientRef.current.publish({
              destination: "/app/room/join",
              body: JSON.stringify(joinMessage),
            });

            setTimeout(() => {
              stompClientRef.current.publish({
                destination: "/app/room/state",
                body: JSON.stringify({ roomCode }),
              });
            }, 1000);
          } catch (error) {
            console.error("❌ Error in WebSocket connection:", error);
          }
        },
        onStompError: (frame) => console.error("❌ STOMP error:", frame),
        onWebSocketClose: () => console.log("⚠️ WebSocket disconnected"),
      });

      stompClientRef.current.activate();
    }

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
      }
    };
  }, [roomCode]);

  useEffect(() => {
    if (timeLeft !== null && timeLeft <= 0 && roomStatus === "waiting") {
      navigate("/");
    }
  }, [timeLeft, roomStatus, navigate]);

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
      <Navbar2 />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white backdrop-blur-sm bg-opacity-90 shadow-xl rounded-2xl p-8 max-w-2xl mx-auto border border-indigo-100 transition-all duration-300 hover:shadow-2xl">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 text-center mb-2 animate-fade-in">
            Welcome to the CodeClash
          </h1>
          <p className="text-center text-gray-600 mb-8 flex items-center justify-center gap-2">
            <span className="px-4 py-1 bg-indigo-50 rounded-full border border-indigo-100">
              Room Code:
              <span className="font-semibold text-indigo-600 ml-1">
                {roomCode || "N/A"}
              </span>
            </span>
          </p>

          {roomStatus === "waiting" && timeLeft !== null && (
            <div className="text-center mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 shadow-inner relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
              <p className="text-lg text-gray-700 flex items-center justify-center gap-3 relative z-10">
                <span className="animate-spin-slow text-2xl">⚔️</span>
                Battle commences in{" "}
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 tabular-nums text-xl">
                  {Math.floor(timeLeft / 60)}:
                  {(timeLeft % 60).toString().padStart(2, "0")}
                </span>
              </p>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="w-20 h-20 border-4 border-transparent border-b-purple-500 rounded-full animate-spin absolute top-0 animate-spin-slow opacity-70"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl animate-pulse">⚔️</span>
                </div>
              </div>
              <p className="mt-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 font-semibold animate-pulse text-lg">
                Summoning warriors...
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 shadow-inner transform hover:scale-[1.02] transition-all duration-300 group">
                <h2 className="text-xl font-semibold flex items-center gap-3">
                  <span className="text-2xl transform group-hover:scale-110 transition-transform duration-300">👑</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    Battle Master:
                  </span>
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    {host || "Assembling..."}
                  </span>
                </h2>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-3">
                  <span className="text-2xl">👥</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    Warriors in Arena ({players.length})
                  </span>
                </h3>
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-1 rounded-xl shadow-lg">
                  <ul className="space-y-2 max-h-60 overflow-y-auto bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-inner">
                    {players.length > 0 ? (
                      players.map((player, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 rounded-lg transition-all duration-300 group"
                        >
                          <span className="w-2 h-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full animate-pulse"></span>
                          {player === host ? (
                            <div className="font-medium flex items-center gap-2">
                              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                {player}
                              </span>
                              <span className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-600 font-semibold group-hover:scale-105 transition-transform duration-300">
                                Battle Master
                              </span>
                            </div>
                          ) : (
                            <span className="font-medium text-gray-700">{player}</span>
                          )}
                        </li>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 font-medium animate-pulse">
                          Awaiting brave warriors to join the battle...
                        </p>
                      </div>
                    )}
                  </ul>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-center">
            <button
              onClick={handleCancel}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition duration-200 font-semibold"
            >
              Exit Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoomJoins;
