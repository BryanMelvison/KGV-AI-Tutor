import Image from "next/image";
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
            <div className="w-10 h-10 mr-4 flex-shrink-0">
              <Image
                src="/bot.png"
                alt="Assistant Bot"
                width={40}
                height={40}
                className="rounded-xl object-cover w-full h-full"
              />
            </div>
          )}

          <div
            className={`max-w-[80%] rounded-2xl px-4 py-2 ${
              message.sender === "user"
                ? "bg-blue-500 text-white"
                : "bg-white shadow-sm"
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
