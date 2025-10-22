// src/components/GroupChatContainer.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Send, LogOut } from "lucide-react";

const GroupChatContainer = () => {
  const { roomName } = useParams();
  const navigate = useNavigate();
  const { authUser, socket } = useAuthStore();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!socket || !authUser) return;

    // Join room
    socket.emit("joinRoom", { roomName, username: authUser.fullName });

    // Handlers
    const handleRoomMessage = (msg) => setMessages((prev) => [...prev, msg]);
    const handleSystemMessage = (msg) =>
      setMessages((prev) => [...prev, { system: true, text: msg }]);

    socket.on("roomMessage", handleRoomMessage);
    socket.on("systemMessage", handleSystemMessage);

    return () => {
      socket.emit("leaveRoom", { roomName, username: authUser.fullName });
      socket.off("roomMessage", handleRoomMessage);
      socket.off("systemMessage", handleSystemMessage);
    };
  }, [socket, authUser, roomName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    socket.emit("roomMessage", {
      roomName,
      sender: authUser.fullName,
      text: message.trim(),
    });
    setMessage(""); // Clear input
  };

  const handleLeave = () => {
    socket.emit("leaveRoom", { roomName, username: authUser.fullName });
    navigate("/"); // redirect to home
  };

  return (
    <div className="flex flex-col h-screen pt-16 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700 sticky top-0 bg-gray-900/80 z-10">
        <h2 className="text-lg font-semibold">Group: {roomName}</h2>
        <button
          onClick={handleLeave}
          className="flex items-center gap-2 text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md"
        >
          <LogOut size={16} /> Leave
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) =>
          msg.system ? (
            <p key={i} className="text-center text-gray-400 text-sm italic">
              {msg.text}
            </p>
          ) : (
            <div
              key={i}
              className={`flex ${
                msg.sender === authUser.fullName ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs ${
                  msg.sender === authUser.fullName
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-700 text-gray-100"
                }`}
              >
                {msg.sender !== authUser.fullName && (
                  <p className="text-xs text-gray-300 mb-1">{msg.sender}</p>
                )}
                <p>{msg.text}</p>
              </div>
            </div>
          )
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-2 p-3 border-t border-gray-700 sticky bottom-0 bg-gray-900 z-10"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="p-2 bg-indigo-600 hover:bg-indigo-700 rounded-full"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default GroupChatContainer;
