export default function StudentInsights({ insights }: { insights: string }) {
  return (
    <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded mt-2">
      <p>{insights}</p>
    </div>
  );
}
