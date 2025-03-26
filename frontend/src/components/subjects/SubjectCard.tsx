"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface SubjectCardProps {
  name: string;
  icon: string;
  color: string;
  progress: number;
  entryChapter: string;
}

const SubjectCard = ({
  name,
  icon,
  color,
  entryChapter,
  progress,
}: SubjectCardProps) => {
  const router = useRouter();
  const handleClick = () => {
    console.log(`/subjects/${name.toLowerCase()}/${entryChapter}`);
    router.push(`/subjects/${name.toLowerCase()}/${entryChapter}`);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition-all border border-[#ECECED] flex flex-col space-y-2"
    >
      <div
        className="w-full h-32 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: color }}
      >
        <Image src={icon} alt={name} width={64} height={64} />
      </div>

      <div>
        <h3 className="font-bold text-lg text-[#17171F]">{name}</h3>
      </div>

      <div>
        <div className="w-full bg-gray-100 h-4 rounded-full">
          <div
            className="bg-indigo-500 h-4 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-[#17171F]">{progress}%</span>
          <span className="text-gray-500">100%</span>
        </div>
      </div>
    </div>
  );
};

export default SubjectCard;
