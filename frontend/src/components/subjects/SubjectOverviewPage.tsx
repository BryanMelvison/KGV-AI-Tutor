import { ChapterData } from "@/api/mockChapter";
import MasteryChecklist from "./MasteryChecklist";
import ExerciseGrid from "./ExerciseGrid";
import ProgressBar from "./ProgressBar";
import UnlockBox from "./UnlockBox";
import AssistantChatSummaries from "./AssistantChatSummaries";

const SubjectOverviewPage = ({ data }: { data: ChapterData }) => {
  return (
    <div className="space-y-6">
      <MasteryChecklist items={data.mastery} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ExerciseGrid exercises={data.exercises} />
          <ProgressBar progress={data.progress} />
        </div>
        <UnlockBox />
      </div>
      <AssistantChatSummaries chats={data.chats} />
    </div>
  );
};

export default SubjectOverviewPage;
