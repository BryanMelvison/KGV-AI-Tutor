const ExerciseGrid = ({ exercises }: { exercises: string[] }) => {
  return (
    <div>
      <h3 className="font-semibold text-lg text-gray-900 mb-4">Exercises</h3>
      <div className="grid grid-cols-5 gap-4">
        {exercises.map((letter) => (
          <div
            key={letter}
            className="rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 text-white text-2xl font-bold w-full aspect-square flex items-center justify-center shadow-md cursor-pointer"
          >
            {letter}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseGrid;
