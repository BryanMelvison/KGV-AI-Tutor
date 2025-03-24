const MasteryChecklist = ({ items }: { items: string[] }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Mastery Checklist
      </h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-green-400" />
            <span className="text-gray-700 text-sm">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MasteryChecklist;
