// Task metadata types for editing

export type DelveMetadata = {
  delves: number;
};

export type PullingMetadata = {
  pulls: number;
};

export type SlayerMetadata = {
  slayer_drop: boolean;
};

export type SkillingMetadata = {
  contracts: number;
  deliveries: number;
  rumors: number;
  swords: number;
  reputation: number;
};

export type TaskMetadataMap = {
  DELVE: DelveMetadata;
  PULLING: PullingMetadata;
  GETTING_HEAD: SlayerMetadata;
  CONTRACT_SKILLER: SkillingMetadata;
};

// Tasks that have editable metadata
export const EDITABLE_TASKS = [
  "DELVE",
  "PULLING",
  "GETTING_HEAD",
  "CONTRACT_SKILLER",
] as const;

export type EditableTaskName = (typeof EDITABLE_TASKS)[number];

// Default values for each task's metadata
export const DEFAULT_METADATA: TaskMetadataMap = {
  DELVE: { delves: 0 },
  PULLING: { pulls: 0 },
  GETTING_HEAD: { slayer_drop: false },
  CONTRACT_SKILLER: {
    contracts: 0,
    deliveries: 0,
    rumors: 0,
    swords: 0,
    reputation: 0,
  },
};

// Human-readable labels for metadata fields
export const METADATA_LABELS: Record<string, string> = {
  delves: "Delve Levels Completed",
  pulls: "Minigame Rewards Pulls",
  slayer_drop: "Got Slayer Unique (Tier 1)",
  contracts: "Mahogany Homes Contracts",
  deliveries: "Gnome Restaurant Deliveries",
  rumors: "Hunter Rumors",
  swords: "Giant's Foundry Swords",
  reputation: "Foundry Reputation",
};

// Descriptions for metadata fields
export const METADATA_DESCRIPTIONS: Record<string, string> = {
  delves: "Total number of delve levels completed",
  pulls: "Skilling minigame rewards pulls",
  slayer_drop: "Check if team has obtained a slayer unique for tier 1",
  contracts: "Number of Mahogany Homes contracts completed",
  deliveries: "Number of Gnome Restaurant Deliveries completed (2 pts each)",
  rumors: "Number of Hunter Rumors completed (4 pts each)",
  swords: "Number of Giant's Foundry Swords completed (6 pts each)",
  reputation: "Total reputation earned (4500 needed for tier 4)",
};
