import { MessageList } from "./MessageList";
import { MessageComposer } from "./MessageComposer";

interface ProjectChatTabProps {
  projectId: string;
}

export function ProjectChatTab({ projectId }: ProjectChatTabProps) {
  return (
    <div className="flex flex-col bg-surface border border-border rounded-2xl h-[32rem] overflow-hidden">
      <MessageList projectId={projectId} />
      <MessageComposer projectId={projectId} />
    </div>
  );
}
