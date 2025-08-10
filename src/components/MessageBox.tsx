import { cn } from "@/lib/utils";
import { Message } from "@/models/Message.model";
import React, { useEffect, useRef } from "react";

interface MessageBoxProps {
  messages: Message[];
  userId: string;
}

const MessageBox = ({ messages, userId }: MessageBoxProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (createdAt: string | Date) => {
    const date = new Date(createdAt);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (createdAt: string | Date) => {
    const date = new Date(createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year:
          date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  const shouldShowDateSeparator = (
    currentMessage: Message,
    previousMessage: Message | null
  ) => {
    if (!previousMessage) return true;

    const currentDate = new Date(currentMessage.createdAt || Date.now());
    const previousDate = new Date(previousMessage.createdAt || Date.now());

    return currentDate.toDateString() !== previousDate.toDateString();
  };

  const shouldShowAvatar = (
    currentMessage: Message,
    nextMessage: Message | null
  ) => {
    if (!nextMessage) return true;
    return currentMessage.user.toString() !== nextMessage.user.toString();
  };

  const getInitials = (userId: string) => {
    return userId.slice(0, 2).toUpperCase();
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No messages yet
            </h3>
            <p className="text-gray-500">
              Start the conversation by sending a message!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="px-4 py-2">
        {messages.map((message, i) => {
          const isOwnMessage = userId === message.user.toString();
          const previousMessage = i > 0 ? messages[i - 1] : null;
          const nextMessage = i < messages.length - 1 ? messages[i + 1] : null;
          const showDateSeparator = shouldShowDateSeparator(
            message,
            previousMessage
          );
          const showAvatar = shouldShowAvatar(message, nextMessage);
          const isConsecutive =
            previousMessage &&
            previousMessage.user.toString() === message.user.toString();

          return (
            <React.Fragment key={i}>
              {/* Date Separator */}
              {showDateSeparator && (
                <div className="flex justify-center my-4">
                  <div className="bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-500 shadow-sm border">
                    {formatDate(message.createdAt)}
                  </div>
                </div>
              )}
              <div
                className={cn(
                  "flex items-end gap-2 mb-1",
                  isOwnMessage ? "justify-end" : "justify-start",
                  isConsecutive && !showDateSeparator ? "mt-1" : "mt-4"
                )}
              >
                {!isOwnMessage && (
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0",
                      showAvatar ? "opacity-100" : "opacity-0"
                    )}
                  >
                    {showAvatar && getInitials(message.user.toString())}
                  </div>
                )}

                <div
                  className={cn(
                    "relative max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl",
                    isOwnMessage ? "order-1" : "order-2"
                  )}
                >
                  <div
                    className={cn(
                      "px-4 py-2 rounded-2xl shadow-sm relative",
                      isOwnMessage
                        ? "bg-green-500 text-white rounded-br-md"
                        : "bg-white text-gray-900 border border-gray-200 rounded-bl-md"
                    )}
                  >
                    <p className="text-sm leading-relaxed break-words">
                      {message.content}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-1 mt-1 text-xs text-gray-500",
                      isOwnMessage ? "justify-end" : "justify-start"
                    )}
                  >
                    <span>{formatTime(message.createdAt)}</span>
                    {isOwnMessage && (
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                {isOwnMessage && <div className="w-8" />}
              </div>
            </React.Fragment>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageBox;
