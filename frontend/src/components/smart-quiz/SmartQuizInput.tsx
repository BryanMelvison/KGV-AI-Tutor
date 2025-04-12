interface SmartQuizInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

const SmartQuizInput = ({ value, onChange, onSubmit }: SmartQuizInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type here..."
        className="flex-1 p-3 rounded-xl border border-gray-200 text-[#747479] focus:border-sky-500 outline-none"
      />
      <button
        onClick={onSubmit}
        className="p-3 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      </button>
    </div>
  );
};

export default SmartQuizInput;
