// Mock data for frontend development
import type { Team, TaskStateRecord, TaskName, TASK_NAMES } from "@/types";

export const mockTeams: Team[] = [
  { id: 1, name: "Iron Titans", points: 285 },
  { id: 2, name: "Zamorak's Chosen", points: 195 },
  { id: 3, name: "Lumbridge Legends", points: 150 },
  { id: 4, name: "Varrock Veterans", points: 110 },
];

// Generate mock task IDs (tasks table has name + tier combination)
// In the DB, task IDs are sequential for each task/tier combo
const generateTaskId = (taskIndex: number, tier: number): number => {
  // Each task can have up to 4 tiers, so we reserve 4 IDs per task
  return taskIndex * 4 + tier;
};

// Generate mock task states for a team
function generateMockTaskStates(
  teamId: number,
  completionProfile: Record<string, number>
): TaskStateRecord[] {
  const taskNames: TaskName[] = [
    "DELVE",
    "WILDY_BOSSES",
    "PULLING",
    "CG",
    "DT2",
    "RAIDS",
    "GETTING_HEAD",
    "CONTRACT_SKILLER",
    "NICE_ROD",
  ];

  const tierCounts: Record<TaskName, number> = {
    DELVE: 3,
    WILDY_BOSSES: 3,
    PULLING: 3,
    CG: 3,
    DT2: 3,
    RAIDS: 3,
    GETTING_HEAD: 3,
    CONTRACT_SKILLER: 4,
    NICE_ROD: 3,
  };

  const states: TaskStateRecord[] = [];

  taskNames.forEach((taskName, taskIndex) => {
    const completedTiers = completionProfile[taskName] || 0;
    const totalTiers = tierCounts[taskName];

    for (let tier = 1; tier <= totalTiers; tier++) {
      const isComplete = tier <= completedTiers;
      const isBlocked = tier > completedTiers + 1;

      states.push({
        id: teamId * 100 + taskIndex * 10 + tier,
        taskId: generateTaskId(taskIndex, tier),
        teamId,
        state: isComplete ? "COMPLETE" : isBlocked ? "BLOCKED" : "INCOMPLETE",
        completedAt: isComplete ? Date.now() - Math.random() * 86400000 : null,
      });
    }
  });

  return states;
}

// Completion profiles for each team (how many tiers completed per task)
export const mockTaskStates = new Map<number, TaskStateRecord[]>([
  [
    1,
    generateMockTaskStates(1, {
      DELVE: 3,
      WILDY_BOSSES: 2,
      PULLING: 1,
      CG: 2,
      DT2: 1,
      RAIDS: 2,
      GETTING_HEAD: 0,
      CONTRACT_SKILLER: 2,
      NICE_ROD: 1,
    }),
  ],
  [
    2,
    generateMockTaskStates(2, {
      DELVE: 1,
      WILDY_BOSSES: 3,
      PULLING: 2,
      CG: 1,
      DT2: 0,
      RAIDS: 1,
      GETTING_HEAD: 2,
      CONTRACT_SKILLER: 1,
      NICE_ROD: 0,
    }),
  ],
  [
    3,
    generateMockTaskStates(3, {
      DELVE: 2,
      WILDY_BOSSES: 1,
      PULLING: 0,
      CG: 0,
      DT2: 2,
      RAIDS: 0,
      GETTING_HEAD: 1,
      CONTRACT_SKILLER: 0,
      NICE_ROD: 2,
    }),
  ],
  [
    4,
    generateMockTaskStates(4, {
      DELVE: 0,
      WILDY_BOSSES: 1,
      PULLING: 1,
      CG: 1,
      DT2: 0,
      RAIDS: 0,
      GETTING_HEAD: 0,
      CONTRACT_SKILLER: 1,
      NICE_ROD: 1,
    }),
  ],
]);

// Task ID to task name/tier mapping
export const mockTasks: Map<number, { name: TaskName; tier: number }> =
  new Map();

const taskNames: TaskName[] = [
  "DELVE",
  "WILDY_BOSSES",
  "PULLING",
  "CG",
  "DT2",
  "RAIDS",
  "GETTING_HEAD",
  "CONTRACT_SKILLER",
  "NICE_ROD",
];

const tierCounts: Record<TaskName, number> = {
  DELVE: 3,
  WILDY_BOSSES: 3,
  PULLING: 3,
  CG: 3,
  DT2: 3,
  RAIDS: 3,
  GETTING_HEAD: 3,
  CONTRACT_SKILLER: 4,
  NICE_ROD: 3,
};

taskNames.forEach((taskName, taskIndex) => {
  for (let tier = 1; tier <= tierCounts[taskName]; tier++) {
    const taskId = generateTaskId(taskIndex, tier);
    mockTasks.set(taskId, { name: taskName, tier });
  }
});
