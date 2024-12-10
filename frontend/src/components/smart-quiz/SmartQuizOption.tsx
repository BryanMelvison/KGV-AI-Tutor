interface Option {
  letter: string;
  title: string;
}

interface SmartQuizOptionProps {
  option: Option;
  isSelected: boolean;
  onClick: () => void;
}

const SmartQuizOption = ({
  option,
  isSelected,
  onClick,
}: SmartQuizOptionProps) => {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border text-left text-[#17171F] transition-colors bg-white ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-blue-500"
      }`}
    >
      {option.letter}. {option.title}
    </button>
  );
};

export default SmartQuizOption;
