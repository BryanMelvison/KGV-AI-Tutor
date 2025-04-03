interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const StatsCard = ({ title, value, icon, color }: StatsCardProps) => {
  return (
    <div
      className={`flex items-center space-x-4 p-4 rounded-xl shadow bg-white border border-gray-100`}
    >
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center`}
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-xl font-bold text-gray-800">{value}</div>
      </div>
    </div>
  );
};

export default StatsCard;
