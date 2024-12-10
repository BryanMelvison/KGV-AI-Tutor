import SmartQuizOption from "./SmartQuizOption";

interface Option {
  letter: string;
  title: string;
}

interface SmartQuizOptionsProps {
  options: Option[];
  selectedOption?: string;
  onSelect: (letter: string) => void;
}

const SmartQuizOptions = ({
  options,
  selectedOption,
  onSelect,
}: SmartQuizOptionsProps) => {
  return (
    <div className="mb-4">
      <div className="text-gray-600 font-medium mb-4">MULTIPLE CHOICE:</div>
      <div className="grid grid-cols-2 gap-4">
        {options.map((option) => (
          <SmartQuizOption
            key={option.letter}
            option={option}
            isSelected={selectedOption === option.letter}
            onClick={() => onSelect(option.letter)}
          />
        ))}
      </div>
    </div>
  );
};

export default SmartQuizOptions;
