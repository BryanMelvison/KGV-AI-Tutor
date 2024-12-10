interface CloseButtonProps {
  onClick: () => void;
}

const CloseButton = ({ onClick }: CloseButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 border border-[#ECECED] rounded-xl bg-white shadow-sm hover:bg-gray-50 flex items-center justify-center transition-colors"
      aria-label="Close"
    >
      <svg
        className="w-4 h-4 text-gray-500"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
};

export default CloseButton;
