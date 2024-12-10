interface SelectedAnswerProps {
  letter?: string | null;
  title?: string;
  onSubmit: () => void;
}

const SelectedAnswer = ({ letter, title, onSubmit }: SelectedAnswerProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="text-gray-600">
        Selected Answer:
        {letter && (
          <span className="ml-2 bg-gray-900 text-white px-4 py-2 rounded-lg">
            {letter}. {title}
          </span>
        )}
      </div>
      <button
        onClick={onSubmit}
        disabled={!letter}
        className={`px-6 py-2 rounded-lg transition-colors ${
          letter
            ? "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        Submit Answer
      </button>
    </div>
  );
};

export default SelectedAnswer;
