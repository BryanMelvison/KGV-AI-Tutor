const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Your Exercise Progress
      </h3>
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div className="bg-sky-500 h-full" style={{ width: `${progress}%` }} />
      </div>
      <p className="text-sm text-gray-600 mt-1">{progress}% Complete</p>
    </div>
  );
};

export default ProgressBar;
