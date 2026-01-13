import { BingoTile } from "./BingoTile";
import type { TaskName, TaskStateRecord } from "@/types";
import { TASK_NAMES, TASK_TIERS } from "@/types";

type BingoBoardProps = {
  taskStates: TaskStateRecord[];
  teamName: string;
};

export function BingoBoard({ taskStates, teamName }: BingoBoardProps) {
  // Group task states by task name
  // The taskStates array contains records for each tier of each task
  // We need to map taskId back to task name and tier
  const getTaskStatesForTask = (
    taskName: TaskName,
    taskIndex: number
  ): TaskStateRecord[] => {
    const totalTiers = TASK_TIERS[taskName];
    // Task states come in order, so we can slice based on index
    // Calculate the start index based on previous tasks' tier counts
    let startIdx = 0;
    for (let i = 0; i < taskIndex; i++) {
      const prevTaskName = TASK_NAMES[i];
      if (prevTaskName) {
        startIdx += TASK_TIERS[prevTaskName];
      }
    }
    return taskStates.slice(startIdx, startIdx + totalTiers);
  };

  // Arrange the 9 tasks in a 3x3 grid
  const gridTasks = TASK_NAMES;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-slate-100">{teamName}</h3>
      <div className="grid grid-cols-3 gap-2">
        {gridTasks.map((taskName, index) => (
          <BingoTile
            key={taskName}
            taskName={taskName}
            tierStates={getTaskStatesForTask(taskName, index)}
          />
        ))}
      </div>
    </div>
  );
}
