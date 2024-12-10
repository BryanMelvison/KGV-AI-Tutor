interface MessagesProps {
  messages: Array<{ text: string; sender: "user" | "assistant" }>;
}

const Messages = ({ messages }: MessagesProps) => {
  return (
    <div className="flex flex-col gap-3 mb-4 max-h-[300px] overflow-y-auto">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.sender === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[80%] rounded-2xl px-4 py-2 ${
              message.sender === "user"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-800"
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
