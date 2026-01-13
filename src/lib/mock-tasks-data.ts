// Mock task data with descriptions for the Tasks detail page

import type { TaskName } from "@/types";

export type TierDetail = {
  tier: number;
  points: number;
  description: string;
  requirements: string[];
};

export type TaskDetail = {
  name: TaskName;
  label: string;
  description: string;
  tiers: TierDetail[];
};

export const mockTaskDetails: TaskDetail[] = [
  {
    name: "DELVE",
    label: "Delve Tile",
    description:
      "Complete delve dungeons and collect rare drops from the depths. Points are earned from dungeon completions and valuable loot.",
    tiers: [
      {
        tier: 1,
        points: 20,
        description: "Reach 150 delve points through completions and drops.",
        requirements: [
          "Delve level completions (varies by level)",
          "Cloth of Mokhaiotl (50 pts)",
          "Eye of Ayak (100 pts)",
          "Avernic Treads (150 pts)",
        ],
      },
      {
        tier: 2,
        points: 30,
        description: "Reach 250 delve points through completions and drops.",
        requirements: ["Same as Tier 1, but need 250 total points"],
      },
      {
        tier: 3,
        points: 40,
        description:
          "Reach 400 delve points and obtain at least one delve unique drop.",
        requirements: [
          "400 total delve points",
          "At least one unique drop required",
        ],
      },
    ],
  },
  {
    name: "WILDY_BOSSES",
    label: "Wildy Boss Tile",
    description:
      "Take on the dangerous wilderness bosses and claim their valuable drops. Risk it all for glory!",
    tiers: [
      {
        tier: 1,
        points: 30,
        description: "Earn 150 points from wilderness boss drops.",
        requirements: [
          "Voidwaker pieces (200 pts each)",
          "Wilderness rings (75 pts each)",
          "Dragon 2H/Pickaxe (50 pts each)",
          "Unique claws/fangs/skull (75 pts each)",
        ],
      },
      {
        tier: 2,
        points: 15,
        description: "Earn 250 points from wilderness boss drops.",
        requirements: ["Same drops as Tier 1, need 250 total"],
      },
      {
        tier: 3,
        points: 15,
        description: "Earn 350 points from wilderness boss drops.",
        requirements: ["Same drops as Tier 1, need 350 total"],
      },
    ],
  },
  {
    name: "PULLING",
    label: "Pulling Tile",
    description:
      "Participate in skilling minigames and pull rewards. Collect unique items along the way.",
    tiers: [
      {
        tier: 1,
        points: 30,
        description: "Earn 150 pull points from minigame rewards.",
        requirements: ["Complete minigame reward pulls"],
      },
      {
        tier: 2,
        points: 30,
        description: "Earn 300 pull points and obtain a fishing/fletching drop.",
        requirements: [
          "300 pull points",
          "One of: Bow String Spool, Fletching Knife, Greenman Mask, Tackle Box, Big Harpoonfish, Fish Barrel, Tome of Water, Dragon Harpoon",
        ],
      },
      {
        tier: 3,
        points: 60,
        description: "Earn 450 pull points and obtain an abyssal drop.",
        requirements: [
          "450 pull points",
          "One of: Catalytic/Elemental Talisman, Abyssal Needle, Abyssal Lantern, Abyssal Dyes",
        ],
      },
    ],
  },
  {
    name: "CG",
    label: "Corrupted Gauntlet",
    description:
      "Challenge the Corrupted Gauntlet and collect crystal seeds. The ultimate test of skill!",
    tiers: [
      {
        tier: 1,
        points: 55,
        description: "Obtain 1 seed point (armour/weapon seed = 1, enhanced = 3).",
        requirements: [
          "Crystal Armour Seed (1 pt)",
          "Crystal Weapon Seed (1 pt)",
          "Enhanced Crystal Weapon Seed (3 pts)",
        ],
      },
      {
        tier: 2,
        points: 20,
        description: "Obtain 2 seed points total.",
        requirements: ["Same as Tier 1, need 2 total points"],
      },
      {
        tier: 3,
        points: 10,
        description:
          "Obtain 3 seed points and an Enhanced Crystal Teleport Seed.",
        requirements: [
          "3 total seed points",
          "Enhanced Crystal Teleport Seed required",
        ],
      },
    ],
  },
  {
    name: "DT2",
    label: "DT2 Bosses",
    description:
      "Defeat the Desert Treasure 2 bosses and collect their powerful artifacts.",
    tiers: [
      {
        tier: 1,
        points: 10,
        description: "Obtain any quartz or awakener's orb.",
        requirements: [
          "Awakener's Orb",
          "Ice/Smoke/Shadow/Blood Quartz",
        ],
      },
      {
        tier: 2,
        points: 70,
        description: "Obtain a Virtus piece, vestige, or gold ring.",
        requirements: [
          "Virtus Robe Top/Bottom/Mask",
          "Magus/Venator/Bellator/Ultor Vestige",
          "Gold Ring",
        ],
      },
      {
        tier: 3,
        points: 80,
        description: "Obtain a boss mega-rare drop.",
        requirements: [
          "Eye of the Duke",
          "Leviathan's Lure",
          "Siren's Staff",
          "Executioner's Axe Head",
        ],
      },
    ],
  },
  {
    name: "RAIDS",
    label: "Raids Tile",
    description:
      "Complete raids and collect powerful loot. CoX, ToB, and ToA all count!",
    tiers: [
      {
        tier: 1,
        points: 50,
        description: "Earn 250 raid points from completions and drops.",
        requirements: [
          "Raid completions (1 pt per KC)",
          "Small uniques (150 pts): Scrolls, Avernic, Fang, Lightbearer, Buckler",
          "Big uniques (300 pts): Masori, Justiciar, Rapier, etc.",
          "Mega-rares (1000 pts): TBow, Scythe, Shadow",
        ],
      },
      {
        tier: 2,
        points: 100,
        description: "Earn 400 raid points from completions and drops.",
        requirements: ["Same as Tier 1, need 400 total"],
      },
      {
        tier: 3,
        points: 50,
        description: "Earn 1000 raid points from completions and drops.",
        requirements: ["Same as Tier 1, need 1000 total"],
      },
    ],
  },
  {
    name: "GETTING_HEAD",
    label: "Getting Head",
    description:
      "Train Slayer and collect monster heads and valuable slayer drops.",
    tiers: [
      {
        tier: 1,
        points: 40,
        description: "Gain 125k Slayer XP and obtain a slayer unique.",
        requirements: [
          "125,000 Slayer XP",
          "Any slayer unique drop (manually verified)",
        ],
      },
      {
        tier: 2,
        points: 40,
        description: "Gain 250k Slayer XP and obtain a monster head.",
        requirements: [
          "250,000 Slayer XP",
          "One of: Abyssal Head, Araxyte Head, Hydra Head, Basilisk Head, Cockatrice Head, KBD Heads, KQ Head, Kurask Head, Vorkath's Head",
        ],
      },
      {
        tier: 3,
        points: 70,
        description: "Gain 300k Slayer XP and obtain a rare slayer unique.",
        requirements: [
          "300,000 Slayer XP",
          "One of: Imbued Heart, Dragon Warhammer, Basilisk Jaw, Mist/Dust Battlestaff, Eternal Gem",
        ],
      },
    ],
  },
  {
    name: "CONTRACT_SKILLER",
    label: "Contract (s)killer",
    description:
      "Complete skilling contracts and minigames. Mahogany Homes, Gnome Restaurant, Hunter Rumors, and Giant's Foundry!",
    tiers: [
      {
        tier: 1,
        points: 15,
        description: "Earn 100 contract points.",
        requirements: [
          "Mahogany Homes Contracts (1 pt)",
          "Gnome Restaurant Deliveries (2 pts)",
          "Hunter Rumors (4 pts)",
          "Giant's Foundry Swords (6 pts)",
        ],
      },
      {
        tier: 2,
        points: 25,
        description: "Earn 200 contract points and obtain 2 Guild Hunter pieces.",
        requirements: [
          "200 contract points",
          "2 Guild Hunter pieces (Headgear, Top, Legs, or Boots)",
        ],
      },
      {
        tier: 3,
        points: 40,
        description: "Earn 300 contract points and obtain a Gnome Scarf.",
        requirements: ["300 contract points", "Gnome Scarf drop"],
      },
      {
        tier: 4,
        points: 20,
        description: "Earn 400 contract points and 4500 Foundry reputation.",
        requirements: ["400 contract points", "4,500 Giant's Foundry reputation"],
      },
    ],
  },
  {
    name: "NICE_ROD",
    label: "Nice Rod",
    description:
      "Collect powerful staves and rods from various activities.",
    tiers: [
      {
        tier: 1,
        points: 25,
        description: "Obtain an Ancient Icon.",
        requirements: ["Ancient Icon drop"],
      },
      {
        tier: 2,
        points: 35,
        description: "Obtain a Trident.",
        requirements: ["Uncharged Trident or Trident of the Seas (full)"],
      },
      {
        tier: 3,
        points: 40,
        description: "Obtain a Pharaoh's Sceptre.",
        requirements: ["Pharaoh's Sceptre drop"],
      },
    ],
  },
];
