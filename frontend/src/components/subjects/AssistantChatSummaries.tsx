interface ChatSummary {
  title: string;
  time: string;
  summary: string;
}

const AssistantChatSummaries = ({ chats }: { chats: ChatSummary[] }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-[#17171F]">
        Assistant Chat Summaries
      </h2>
      {chats.map((chat, index) => (
        <div key={index} className="mb-4 border-b pb-4 last:border-none">
          <div className="flex items-center justify-between w-full mb-2">
            <h3 className="font-semibold text-base text-[#17171F]">
              {chat.title}
            </h3>
            <span className="text-xs font-medium text-[#747479]">
              {chat.time}
            </span>
          </div>
          <p className="text-sm text-[#747479]">{chat.summary}</p>
        </div>
      ))}
    </div>
  );
};

export default AssistantChatSummaries;
