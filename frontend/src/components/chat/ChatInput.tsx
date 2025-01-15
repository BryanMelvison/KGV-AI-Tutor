import { useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  onClear?: () => void;
  isLoading: boolean;
  submitButtonText?: string;
  placeholder?: string;
}

const ChatInput = ({
  onSend,
  onClear,
  isLoading,
  submitButtonText = "Send",
  placeholder = "Type your message...",
}: ChatInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    if (inputValue.trim() && !isLoading) {
      onSend(inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="bg-whitepx-6">
      <div className="w-full mx-auto">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder={placeholder}
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
          <button
            onClick={onClear}
            className="p-6 rounded-lg bg-red-500 hover:bg-red-600"
            title="Clear chat history"
          ></button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
