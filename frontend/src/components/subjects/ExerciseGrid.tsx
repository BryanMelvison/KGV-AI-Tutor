"use client";
import { useRouter, useSearchParams } from "next/navigation";

const COLORS = [
  "from-pink-300 to-pink-400",
  "from-purple-300 to-purple-400",
  "from-blue-300 to-blue-400",
  "from-green-300 to-green-400",
  "from-yellow-300 to-yellow-400",
  "from-red-300 to-red-400",
];

const ExerciseGrid = ({ exercises }: { exercises: string[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("exercise");

  const handleClick = (letter: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("exercise", letter);
    router.push(`?${newParams.toString()}`);
  };

  return (
    <div>
      <h3 className="font-semibold text-lg text-gray-900 mb-4">Exercises</h3>
      <div className="grid grid-cols-4 gap-4">
        {exercises.map((letter, i) => (
          <div
            key={letter}
            onClick={() => handleClick(letter)}
            className={`rounded-xl text-6xl font-bold w-full aspect-square flex items-center justify-center shadow-md cursor-pointer transition-transform duration-200
              ${
                current === letter
                  ? "bg-blue-100 ring-4 ring-blue-300 text-blue-700"
                  : `bg-gradient-to-br ${COLORS[i % COLORS.length]} text-white`
              }
              hover:-translate-y-1 hover:shadow-lg
              `}
          >
            {letter}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseGrid;
