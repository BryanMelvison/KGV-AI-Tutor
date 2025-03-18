"use client";

import { Message } from "@/interfaces/Message";
import Messages from "../Messages";
import { useCallback, useEffect, useRef, useState } from "react";

interface ChatContainerProps {
  title?: string;
  description?: string;
  messages: Message[];
  isLoading: boolean;
  onSend: (message: string) => void;
  onClear?: () => void;
  actions?: React.ReactNode;
  submitButtonText?: string;
  headerContent?: React.ReactNode;
  inputPlaceholder?: string;
}

const ChatContainer = ({
  title,
  description,
  messages,
  isLoading,
  onSend,
  onClear,
  actions,
  submitButtonText = "Send",
  headerContent,
  inputPlaceholder = "Type your message...",
}: ChatContainerProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [breaklines, setBreaklines] = useState<number[]>([]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (messages.length > 0 || breaklines.length > 0) {
      scrollToBottom();
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages, breaklines, scrollToBottom]);

  const handleSubmit = () => {
    if (inputValue.trim() && !isLoading) {
      onSend(inputValue);
      setInputValue("");
    }
  };

  const handleClear = () => {
    if (onClear) {
      setBreaklines((prev) => [...prev, messages.length]);
      onClear();
    }
  };

  const renderMessages = () => {
    let result = [];
    let lastBreakIndex = 0;

    messages.forEach((message, index) => {
      if (breaklines.includes(lastBreakIndex)) {
        result.push(
          <div key={`break-${lastBreakIndex}`} className="my-8 relative">
            <div className="border-t border-gray-200 flex-grow"></div>
            <div className="absolute inset-0 flex justify-center items-center">
              <span className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm">
                Context cleared
              </span>
            </div>
            <div className="border-t border-gray-200 flex-grow"></div>
          </div>
        );
      }
      result.push(<Messages key={index} messages={[message]} />);
      lastBreakIndex = index + 1;
    });

    // final breakline if it exists
    if (breaklines.includes(messages.length)) {
      result.push(
        <div key={`break-${messages.length}`} className="my-8 relative">
          <div className="border-t border-gray-200 flex-grow"></div>
          <div className="absolute inset-0 flex justify-center items-center">
            <span className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm">
              Context cleared
            </span>
          </div>
          <div className="border-t border-gray-200 flex-grow"></div>
        </div>
      );
    }

    return result;
  };

  return (
    <div className="h-full flex flex-col bg-white py-4 shadow-md">
      {/* Header Section */}
      {(title || description || actions || headerContent) && (
        <div className="bg-white px-6 pb-4 flex-shrink-0">
          {headerContent || (
            <div className="flex justify-between items-center">
              <div>
                {title && (
                  <h2 className="text-2xl font-semibold text-[#17171F]">
                    {title}
                  </h2>
                )}
                {description && <p className="text-gray-500">{description}</p>}
              </div>
              {actions && <div className="flex gap-3">{actions}</div>}
            </div>
          )}
        </div>
      )}

      {/* Chat Section */}
      <div className="flex-1 flex flex-col bg-[#F9F9FE] mx-5 p-4 rounded-2xl min-h-0">
        <div className="flex-1 overflow-y-auto">
          {renderMessages()}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex-shrink-0">
          <div>
            <div className="w-full mx-auto flex items-center">
              <div className="relative flex-grow">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder={inputPlaceholder}
                  disabled={isLoading}
                  className="w-full px-4 py-3 text-[#17171F] rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-24 disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !inputValue.trim()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {submitButtonText}
                </button>
              </div>
              {onClear && (
                <button
                  onClick={handleClear}
                  className="ml-4 p-3 rounded-lg text-white bg-red-500 hover:bg-red-600"
                  title="Clear chat history"
                >
                  Clear Context
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;