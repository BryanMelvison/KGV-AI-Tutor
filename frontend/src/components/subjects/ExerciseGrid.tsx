"use client";
import { useRouter, useSearchParams } from "next/navigation";

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
      <div className="grid grid-cols-5 gap-4">
        {exercises.map((letter) => (
          <div
            key={letter}
            onClick={() => handleClick(letter)}
            className={`rounded-xl text-2xl font-bold w-full aspect-square flex items-center justify-center shadow-md cursor-pointer transition
              ${
                current === letter
                  ? "bg-purple-500 text-white"
                  : "bg-gradient-to-br from-purple-100 to-purple-200 text-white"
              }`}
          >
            {letter}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseGrid;
