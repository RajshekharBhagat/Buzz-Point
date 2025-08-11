"use client";
import { useEffect, useState, useRef } from "react";
import { initSocket } from "@/lib/socket";
import { useSession } from "next-auth/react";
import { Message } from "@/models/Message.model";
import { Socket } from "socket.io-client";
import MessageBox from "./MessageBox";
import { Hive } from "@/models/Hives.model";
import { SendHorizontalIcon } from "lucide-react";

export default function HiveChatroom({ hive }: { hive: Hive }) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hiveId = hive._id;

  useEffect(() => {
    if (!session?.accessToken) return;
    const socket = initSocket(session.accessToken);
    socketRef.current = socket;

    socket.emit("join-chatroom", hiveId);

    socket.on("chatroom:history", (history) => {
      setMessages(history);
    });

    socket.on("chatroom:message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("chatroom:history");
      socket.off("chatroom:message");
      socket.emit("leave-chatroom", hiveId);
      socket.disconnect();
    };
  }, [hiveId, session?.accessToken]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  }, [input]);

  const sendMessage = () => {
    if (!input.trim() || !socketRef.current) return;
    socketRef.current.emit("chatroom:message", { hiveId, content: input });
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const isConnected = socketRef.current?.connected ?? false;

  return (
    <div className="flex flex-col h-[85vh]">
      {/* HEADER */}
      <div className="flex z-20 items-center justify-between px-6 py-2 bg-white border-b border-gray-200 rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
            {hive.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{hive.name}</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-xs">{isConnected ? "Connected" : "Disconnected"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SCROLLABLE MESSAGES */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <MessageBox messages={messages} userId={session?.user?.id} />
      </div>

      {/* INPUT BOX */}
      <div className="bg-white border-t border-gray-200 p-2 rounded-b-xl">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <div className="relative bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-green-500 focus-within:bg-white transition-all duration-200 shadow-sm">
              <textarea
                ref={textareaRef}
                className="w-full bg-transparent px-4 py-3 pr-12 resize-none border-0 focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-500 text-sm leading-relaxed max-h-32 min-h-[44px]"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                rows={1}
                disabled={!isConnected}
              />
            </div>
          </div>
          <button
            onClick={sendMessage}
            disabled={!input.trim() || !isConnected}
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
              input.trim() && isConnected
                ? "bg-green-500 hover:bg-green-600 text-white transform hover:scale-105 active:scale-95"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            type="button"
            title={
              !isConnected
                ? "Not connected"
                : input.trim()
                ? "Send message"
                : "Type a message"
            }
          >
            <SendHorizontalIcon />
          </button>
        </div>
        {!isConnected && (
          <div className="mt-3 text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 text-xs rounded-full">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Connection lost. Trying to reconnect...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
