export default function SmartQuizStats({ stats }: { stats: SmartQuizStats }) {
  return (
    <div>
      <p className="text-gray-600 mb-2">
        Quiz summary: scores and frequent mistakes.
      </p>
      <ul className="list-disc pl-5 text-gray-700 space-y-1">
        <li>Average Score: {stats.averageScore}%</li>
        <li>Common Mistakes: {stats.commonMistakes}</li>
        <li>Weak Learning Objectives: {stats.weakObjectives.join(", ")}</li>
      </ul>
    </div>
  );
}
