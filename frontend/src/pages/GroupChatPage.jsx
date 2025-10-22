import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const GroupChatPage = () => {
  const [roomName, setRoomName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { authUser, socket } = useAuthStore();

  const handleJoinOrCreateRoom = (action) => (e) => {
    e.preventDefault();
    if (!roomName || !password) return alert("Room name and password are required");

    socket?.emit("join_room", { roomName, user: authUser.fullName });
    navigate(`/group/${roomName}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-500 to-indigo-600 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Welcome {authUser?.fullName || "User"} to{" "}
          <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-transparent bg-clip-text">
            VibeChat
          </span>
        </h1>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Room Name
            </label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter room name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter room password"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button
              type="submit"
              onClick={handleJoinOrCreateRoom("create")}
              className="flex-1 bg-indigo-500 text-white font-semibold py-2 rounded-lg hover:bg-indigo-600 transition-colors"
            >
              Create Room
            </button>
            <button
              type="submit"
              onClick={handleJoinOrCreateRoom("join")}
              className="flex-1 bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Join Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupChatPage;
