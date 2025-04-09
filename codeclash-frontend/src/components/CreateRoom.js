import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar2 from "./Navbar2";

const CreateRoom = () => {
  const [difficulty, setDifficulty] = useState("");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = sessionStorage.getItem('Authtoken');

  const createRoom = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8788/api/room/create", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          host: localStorage.getItem("Username"),
          difficulty,
          topic
        })
      });

      if (!res.ok) throw new Error("Failed to create room");

      const roomCode = await res.text();
      navigate(`/waitingroom/${roomCode}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-50">
      <Navbar2 />
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-8 border border-indigo-100/50 transition-all duration-300 hover:shadow-indigo-200/50">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 text-center mb-8 animate-fade-in">
            Create Battle Arena
          </h1>

          {error && (
            <div className="p-4 mb-6 text-red-600 bg-red-50 rounded-xl border border-red-100 flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <p className="font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <div className="group">
              <label className="block text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
                Choose Your Destiny
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer hover:shadow-md"
              >
                <option value="">Choose Your Rank</option>
                <option value="easy">🌟 Novice Scout</option>
                <option value="medium">🔥 Battle-Hardened Warrior</option>
                <option value="hard">⚔️ Legendary Champion</option>
              </select>
            </div>

            <div className="group">
              <label className="block text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
                Select Your Battleground
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer hover:shadow-md"
              >
                <option value="">Choose Your Battle Ground</option>
                <option value="arrays">🗡️ Array Arena</option>
                <option value="strings">⚡ String Sorcery</option>
                <option value="linkedlists">⛓️ Chain Combat</option>
                <option value="trees">🌳 Binary Tree Battleground</option>
                <option value="graphs">🕸️ Graph Galaxy</option>
                <option value="dynamic">🔮 Dynamic Programming Dojo</option>
                <option value="recursion">🔄 Recursion Realm</option>
              </select>
            </div>

            <button
              onClick={createRoom}
              disabled={loading || !difficulty || !topic}
              className={`w-full px-6 py-4 mt-4 text-white text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <span className="animate-spin text-xl">⚔️</span>
                  Summoning Arena...
                </>
              ) : (
                <>
                  <span>⚔️</span>
                  Forge Your Arena
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
