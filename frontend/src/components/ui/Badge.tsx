interface BadgeProps {
  children: React.ReactNode;
}

const Badge = ({ children }: BadgeProps) => {
  return (
    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
      {children}
    </span>
  );
};

export default Badge;
