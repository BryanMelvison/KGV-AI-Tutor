import Image from "next/image";

const TypingIndicator = () => {
  return (
    <div className="flex justify-start items-end gap-2 mt-1">
      <div className="w-10 h-10 flex-shrink-0">
        <Image
          src="/bot.png"
          alt="Assistant Bot"
          width={40}
          height={40}
          className="rounded-xl object-cover w-full h-full"
        />
      </div>

      <div className="bg-white shadow-sm rounded-2xl px-4 py-2 max-w-[80%] min-h-10 flex items-center gap-1">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0s]" />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
      </div>
    </div>
  );
};

export default TypingIndicator;
