interface SmartQuizQuestionProps {
  title: string;
  description: string;
}

const SmartQuizQuestion = ({ title, description }: SmartQuizQuestionProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl text-[#17171F] font-semibold mb-2">{title}</h2>
      <p className="text-[#747479]">{description}</p>
    </div>
  );
};

export default SmartQuizQuestion;
