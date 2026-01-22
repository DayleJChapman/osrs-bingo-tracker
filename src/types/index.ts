// Frontend type definitions for the bingo tracker

export type Team = {
  id: number;
  name: string;
  points: number;
};

export type Player = {
  id: number;
  username: string;
  displayName: string;
  womId: number;
  teamId: number;
  isTeamCaptain: boolean;
};

export type TeamWithMembers = Team & {
  members: Player[];
};

export type TaskState = "COMPLETE" | "INCOMPLETE" | "BLOCKED";

export type TaskStateRecord = {
  id: number;
  taskId: number;
  teamId: number;
  state: TaskState;
  completedAt: number | null;
};

export type Task = {
  id: number;
  name: string;
  tier: number;
  pointValue: number;
};

export type TierDetail = {
  description: string;
  requirements: string[];
  points: number;
};
export type TaskDetail = {
  name: string;
  label: string;
  description: string;
  requirements?: string[];
  bosses: string[];
  skills: string[];
  drops: string[];
  tiers: Record<string, TierDetail>;
};
export type TaskList = Record<string, TaskDetail>;

// The 9 bingo tasks
export const TASK_NAMES = [
  "DELVE",
  "WILDY_BOSSES",
  "PULLING",
  "CG",
  "DT2",
  "RAIDS",
  "GETTING_HEAD",
  "CONTRACT_SKILLER",
  "NICE_ROD",
] as const;

export type TaskName = (typeof TASK_NAMES)[number];

// Human-readable labels for each task
export const TASK_LABELS: Record<TaskName, string> = {
  DELVE: "Delve Tile",
  WILDY_BOSSES: "Wildy Boss",
  PULLING: "Pulling Tile",
  CG: "Corrupted Gauntlet",
  DT2: "DT2 Bosses",
  RAIDS: "Raids Tile",
  GETTING_HEAD: "Getting Head",
  CONTRACT_SKILLER: "Contract (s)killer",
  NICE_ROD: "Nice Rod",
};

// Number of tiers for each task
export const TASK_TIERS: Record<TaskName, number> = {
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

// Points per tier for each task
export const TASK_POINTS: Record<TaskName, number[]> = {
  DELVE: [20, 30, 40],
  WILDY_BOSSES: [30, 15, 15],
  PULLING: [30, 30, 60],
  CG: [55, 20, 10],
  DT2: [10, 70, 80],
  RAIDS: [50, 100, 50],
  GETTING_HEAD: [40, 40, 70],
  CONTRACT_SKILLER: [15, 25, 40, 20],
  NICE_ROD: [25, 35, 40],
};

// Task completion status for UI display
export type TileProgress = {
  taskName: TaskName;
  completedTiers: number;
  totalTiers: number;
  earnedPoints: number;
  totalPoints: number;
};
