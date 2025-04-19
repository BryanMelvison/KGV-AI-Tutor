interface SelectedAnswerProps {
  letter?: string | null;
  title?: string;
  onSubmit: () => void;
}

const SelectedAnswer = ({ letter, title, onSubmit }: SelectedAnswerProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0 sm:space-x-4">
      <div className="text-gray-600 flex items-start sm:items-center">
        <span className="mr-2 font-medium">Selected Answer:</span>
        {letter && (
          <span className="bg-sky-900 text-white px-4 py-2 rounded-lg break-words max-w-xs sm:max-w-sm">
            {letter}. {title}
          </span>
        )}
      </div>
      <button
        onClick={onSubmit}
        disabled={!letter}
        className={`w-full sm:w-auto px-6 py-2 rounded-lg transition-colors ${
          letter
            ? "bg-sky-500 hover:bg-sky-600 text-white cursor-pointer"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        Submit Answer
      </button>
    </div>
  );
};

export default SelectedAnswer;
