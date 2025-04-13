import { Message } from "@/interfaces/Message";

interface MessagesProps {
  messages: Message[];
  className?: string;
}

const Messages = ({ messages, className }: MessagesProps) => {
  return (
    <div
      className={`flex flex-col gap-3 mb-4 overflow-y-auto ${className || ""}`}
    >
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.sender === "user" ? "justify-end" : "justify-start"
          }`}
        >
          {message.sender === "assistant" && (
            <div className="w-12 h-12 bg-[#7F56DA] rounded-xl flex-shrink-0 mr-4" />
          )}
          <div
            className={`max-w-[80%] rounded-2xl px-4 py-2 ${
              message.sender === "user"
                ? "bg-blue-500 text-white"
                : "bg-white shadow-sm "
            }`}
          >
            {message.text}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Messages;
