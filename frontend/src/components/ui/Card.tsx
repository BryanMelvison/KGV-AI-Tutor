interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className }: CardProps) => {
  return (
    <div className={`bg-white rounded-3xl shadow-lg ${className || ""}`}>
      {children}
    </div>
  );
};

export default Card;
