import Badge from "../ui/Badge";

interface SmartQuizHeaderProps {
  timeRemaining: number;
  currentQuestion: number;
  totalQuestions: number;
}

const SmartQuizHeader = ({
  timeRemaining,
  currentQuestion,
  totalQuestions,
}: SmartQuizHeaderProps) => {
  const progress = (currentQuestion / totalQuestions) * 100;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4 w-full">
        <div className="border border-[#ECECED] flex items-center bg-white gap-1 py-2 px-2.5 rounded-xl">
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className={` ${timeRemaining <= 60 ? "text-red-500" : ""}`}>
            Time Left: {formattedTime}
          </span>
        </div>
        <div className="h-1 flex-1 bg-sky-100 rounded">
          <div
            className="h-full bg-sky-500 rounded transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <Badge>
          Question {currentQuestion}/{totalQuestions}
        </Badge>
      </div>
    </div>
  );
};

export default SmartQuizHeader;
