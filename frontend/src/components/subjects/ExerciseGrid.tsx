"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { FaLock } from "react-icons/fa";

const COLORS = [
  "from-pink-300 to-pink-400",
  "from-purple-300 to-purple-400",
  "from-blue-300 to-blue-400",
  "from-green-300 to-green-400",
  "from-yellow-300 to-yellow-400",
  "from-red-300 to-red-400",
];

type Exercise = {
  id: string;
  completed: boolean;
  secretLetter?: string;
};

const ExerciseGrid = ({ exercises }: { exercises: Exercise[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("exercise");

  const handleClick = (id: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("exercise", id);
    router.push(`?${newParams.toString()}`);
  };

  return (
    <div>
      <h3 className="font-semibold text-lg  mb-4">Your Exercises</h3>
      <div className="grid grid-cols-4 gap-4">
        {exercises.map((exercise, i) => (
          <div
            key={exercise.id}
            onClick={() => handleClick(exercise.id)}
            className={`
              group rounded-2xl w-full aspect-square shadow-lg flex items-center justify-center p-3 text-center transition-transform duration-200 cursor-pointer
              ${
                exercise.completed
                  ? "bg-yellow-100 border border-yellow-300 text-yellow-800"
                  : `bg-gradient-to-br ${
                      COLORS[i % COLORS.length]
                    } text-white text-5xl font-extrabold`
              }
              ${
                current === exercise.id
                  ? "ring-4 ring-yellow-400 scale-[1.02]"
                  : ""
              }
              hover:-translate-y-1 hover:shadow-xl
            `}
          >
            {exercise.completed ? (
              <div className="flex flex-col items-center">
                <FaLock className="text-yellow-700 text-sm mb-1 animate-wiggle opacity-80 group-hover:opacity-0 transition-opacity duration-300" />
                <span className="text-xs font-medium text-yellow-700 text-center">
                  Your secret letter is:
                </span>
                <span className="text-3xl font-bold text-yellow-900 mt-1">
                  {exercise.secretLetter}
                </span>
              </div>
            ) : (
              exercise.id
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseGrid;
