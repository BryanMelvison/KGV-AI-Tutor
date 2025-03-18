import { Message } from "@/interfaces/Message";
import Messages from "../Messages";
import ChatInput from "./ChatInput";
import { useCallback, useEffect, useRef } from "react";

interface ChatContainerProps {
  title?: string;
  description?: string;
  messages: Message[];
  isLoading: boolean;
  onSend: (message: string) => void;
<<<<<<< HEAD
=======
  onClear?: () => void;
>>>>>>> origin/main
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
<<<<<<< HEAD
=======
  onClear,
>>>>>>> origin/main
  actions,
  submitButtonText = "Send",
  headerContent,
  inputPlaceholder = "Type your message...",
}: ChatContainerProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);
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
          <Messages messages={messages} />
          <div ref={messagesEndRef} />
        </div>
        <div className="flex-shrink-0">
          <ChatInput
            onSend={onSend}
<<<<<<< HEAD
=======
            onClear={onClear}
>>>>>>> origin/main
            isLoading={isLoading}
            submitButtonText={submitButtonText}
            placeholder={inputPlaceholder}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
