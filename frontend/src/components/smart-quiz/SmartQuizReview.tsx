import { UserAnswer, Question } from "@/context/SmartQuizContext";

const SmartQuizReview = ({
  reviewAnswers,
  questions,
}: {
  reviewAnswers: UserAnswer[];
  questions: Question[];
}) => {
  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      {reviewAnswers.map((answer, index) => {
        const question = questions.find((q) => q.id === answer.questionId);
        return (
          <div
            key={answer.questionId}
            className="bg-white p-4 rounded-lg shadow space-y-2"
          >
            <p className="font-semibold">
              Q{index + 1}. {question?.title}
            </p>
            <p className="text-sm text-gray-600">
              Your Answer:{" "}
              <span
                className={
                  answer.selected === answer.correct
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {answer.selected}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Correct Answer: {answer.correct}
            </p>
            <p className="text-sm text-blue-600">💡 {answer.explanation}</p>
          </div>
        );
      })}
    </div>
  );
};

export default SmartQuizReview;
