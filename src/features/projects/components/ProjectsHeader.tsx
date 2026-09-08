import { AddProjectButton } from "./AddProjectButton";

export function ProjectsHeader() {
  return (
    <div className="flex justify-between items-center gap-4">
      <div>
        <h1 className="font-bold text-text-primary text-2xl">Projects</h1>
        <p className="text-text-secondary text-sm">
          Track and manage the work you have in progress.
        </p>
      </div>

      <AddProjectButton />
    </div>
  );
}
