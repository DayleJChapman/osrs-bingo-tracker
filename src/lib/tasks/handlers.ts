import type { drops, xpGains, bossKc } from "../db/schema";

export type DropsData = typeof drops.$inferSelect;
export type SkillsData = typeof xpGains.$inferSelect;
export type BossesData = typeof bossKc.$inferSelect;

type HandlerParams = {
  drops: DropsData[];
  skills: SkillsData[];
  bosses: BossesData[];
  metadata?: Record<string, unknown>;
};

export const handlers = {
  delve: {
    tierOne: async ({ drops, metadata }: HandlerParams) => {
      let delvePoints = 0;

      if (
        metadata &&
        metadata["delves"] &&
        typeof metadata["delves"] === "number"
      ) {
        delvePoints = metadata["delves"];
      }

      for (const drop of drops) {
        if (["cloth of mokhaiotl"].includes(drop.item.toLowerCase())) {
          delvePoints += 50;
        } else if (["eye of ayak"].includes(drop.item.toLowerCase())) {
          delvePoints += 100;
        } else if (["avernic treads"].includes(drop.item.toLowerCase())) {
          delvePoints += 150;
        }
      }

      return delvePoints >= 150;
    },
    tierTwo: async ({ drops, metadata }: HandlerParams) => {
      let delvePoints = 0;

      if (
        metadata &&
        metadata["delves"] &&
        typeof metadata["delves"] === "number"
      ) {
        delvePoints = metadata["delves"];
      }

      for (const drop of drops) {
        if (["cloth of mokhaiotl"].includes(drop.item.toLowerCase())) {
          delvePoints += 50;
        } else if (["eye of ayak"].includes(drop.item.toLowerCase())) {
          delvePoints += 100;
        } else if (["avernic treads"].includes(drop.item.toLowerCase())) {
          delvePoints += 150;
        }
      }

      return delvePoints >= 250;
    },
    tierThree: async ({ metadata, drops }: HandlerParams) => {
      let delvePoints = 0;
      let dropFound = false;

      if (
        metadata &&
        metadata["delves"] &&
        typeof metadata["delves"] === "number"
      ) {
        delvePoints = metadata["delves"];
      }

      for (const drop of drops) {
        if (["cloth of mokhaiotl"].includes(drop.item.toLowerCase())) {
          delvePoints += 50;
          dropFound = true;
        } else if (["eye of ayak"].includes(drop.item.toLowerCase())) {
          delvePoints += 100;
          dropFound = true;
        } else if (["avernic treads"].includes(drop.item.toLowerCase())) {
          delvePoints += 150;
          dropFound = true;
        }
      }

      return delvePoints >= 400 && dropFound;
    },
  },
  wildy: {
    tierOne: async ({ drops }: HandlerParams) => {
      const requiredPoints = 150;
      let points = 0;

      const dropsVoidwaker = [
        "voidwaker hilt",
        "voidwaker gem",
        "voidwaker blade",
      ];
      const dropsRings = [
        "treasonous ring",
        "ring of the gods",
        "tyrannical ring",
      ];
      const dropsDragon = ["dragon 2h sword", "dragon pickaxe"];
      const dropsUnique = [
        "claws of callisto",
        "fangs of venenatis",
        "skull of vet'ion",
      ];

      for (const drop of drops) {
        if (dropsVoidwaker.includes(drop.item)) {
          points += 200;
        } else if (dropsRings.includes(drop.item)) {
          points += 75;
        } else if (dropsDragon.includes(drop.item)) {
          points += 50;
        } else if (dropsUnique.includes(drop.item)) {
          points += 75;
        }
      }

      return points >= requiredPoints;
    },
    tierTwo: async ({ drops }: HandlerParams) => {
      const requiredPoints = 250;
      let points = 0;

      const dropsVoidwaker = [
        "voidwaker hilt",
        "voidwaker gem",
        "voidwaker blade",
      ];
      const dropsRings = [
        "treasonous ring",
        "ring of the gods",
        "tyrannical ring",
      ];
      const dropsDragon = ["dragon 2h sword", "dragon pickaxe"];
      const dropsUnique = [
        "claws of callisto",
        "fangs of venenatis",
        "skull of vet'ion",
      ];

      for (const drop of drops) {
        if (dropsVoidwaker.includes(drop.item)) {
          points += 200;
        } else if (dropsRings.includes(drop.item)) {
          points += 75;
        } else if (dropsDragon.includes(drop.item)) {
          points += 50;
        } else if (dropsUnique.includes(drop.item)) {
          points += 75;
        }
      }

      return points >= requiredPoints;
    },
    tierThree: async ({ drops }: HandlerParams) => {
      const requiredPoints = 350;
      let points = 0;

      const dropsVoidwaker = [
        "voidwaker hilt",
        "voidwaker gem",
        "voidwaker blade",
      ];
      const dropsRings = [
        "treasonous ring",
        "ring of the gods",
        "tyrannical ring",
      ];
      const dropsDragon = ["dragon 2h sword", "dragon pickaxe"];
      const dropsUnique = [
        "claws of callisto",
        "fangs of venenatis",
        "skull of vet'ion",
      ];

      for (const drop of drops) {
        if (dropsVoidwaker.includes(drop.item)) {
          points += 200;
        } else if (dropsRings.includes(drop.item)) {
          points += 75;
        } else if (dropsDragon.includes(drop.item)) {
          points += 50;
        } else if (dropsUnique.includes(drop.item)) {
          points += 75;
        }
      }

      return points >= requiredPoints;
    },
  },
  pulling: {
    tierOne: async ({ metadata }: HandlerParams) => {
      const requiredPoints = 150;
      let points = 0;

      if (
        metadata &&
        metadata["pulls"] &&
        typeof metadata["pulls"] === "number"
      ) {
        points = metadata["pulls"];
      }

      return points >= requiredPoints;
    },
    tierTwo: async ({ metadata, drops }: HandlerParams) => {
      const requiredPoints = 300;
      let points = 0;
      let dropFound = false;
      const requiredDrops = [
        "bow string spool",
        "fletching knife",
        "greenman mask",
        "tackle box",
        "big harpoonfish",
        "fish barrel",
        "tome of water (empty)",
        "dragon harpoon",
      ];

      if (
        metadata &&
        metadata["pulls"] &&
        typeof metadata["pulls"] === "number"
      ) {
        points = metadata["pulls"];
      }

      for (const drop of drops) {
        if (requiredDrops.includes(drop.item)) {
          dropFound = true;
        }
      }

      return points >= requiredPoints && dropFound;
    },
    tierThree: async ({ metadata, drops }: HandlerParams) => {
      const requiredPoints = 450;
      let points = 0;
      let dropFound = false;
      const requiredDrops = [
        "catalytic talisman",
        "elemental talisman",
        "abyssal needle",
        "abyssal lantern",
        "abyssal blue dye",
        "abyssal green dye",
        "abyssal red dye",
      ];

      if (
        metadata &&
        metadata["pulls"] &&
        typeof metadata["pulls"] === "number"
      ) {
        points = metadata["pulls"];
      }

      for (const drop of drops) {
        if (requiredDrops.includes(drop.item)) {
          dropFound = true;
        }
      }

      return points >= requiredPoints && dropFound;
    },
  },
  cg: {
    tierOne: async ({ drops }: HandlerParams) => {
      const requiredPoints = 1;
      let points = 0;

      const smallDrops = ["crystal armour seed", "crystal weapon seed"];
      const bigDrops = ["enhanced crystal weapon seed"];

      for (const drop of drops) {
        if (smallDrops.includes(drop.item)) {
          points += 1;
        } else if (bigDrops.includes(drop.item)) {
          points += 3;
        }
      }

      return points >= requiredPoints;
    },
    tierTwo: async ({ drops }: HandlerParams) => {
      const requiredPoints = 2;
      let points = 0;

      const smallDrops = ["crystal armour seed", "crystal weapon seed"];
      const bigDrops = ["enhanced crystal weapon seed"];

      for (const drop of drops) {
        if (smallDrops.includes(drop.item)) {
          points += 1;
        } else if (bigDrops.includes(drop.item)) {
          points += 3;
        }
      }

      return points >= requiredPoints;
    },
    tierThree: async ({ drops }: HandlerParams) => {
      const requiredPoints = 3;
      let points = 0;
      let dropFound = false;

      const smallDrops = ["crystal armour seed", "crystal weapon seed"];
      const bigDrops = ["enhanced crystal weapon seed"];

      for (const drop of drops) {
        if (smallDrops.includes(drop.item)) {
          points += 1;
        } else if (bigDrops.includes(drop.item)) {
          points += 3;
        } else if (drop.item === "enhanced crystal teleport seed") {
          dropFound = true;
        }
      }

      return points >= requiredPoints && dropFound;
    },
  },
  dt2: {
    tierOne: async ({ drops }: HandlerParams) => {
      const requiredDrops = [
        "awakener's orb",
        "ice quartz",
        "smoke quartz",
        "shadow quartz",
        "blood quartz",
      ];

      for (const drop of drops) {
        if (requiredDrops.includes(drop.item)) {
          return true;
        }
      }

      return false;
    },
    tierTwo: async ({ drops }: HandlerParams) => {
      const requiredDrops = [
        "virtus robe top",
        "virtus robe bottom",
        "virtus mask",
        "magus vestige",
        "venator vestige",
        "bellator vestige",
        "ultor vestige",
        "gold ring",
      ];

      for (const drop of drops) {
        if (requiredDrops.includes(drop.item)) {
          return true;
        }
      }

      return false;
    },
    tierThree: async ({ drops }: HandlerParams) => {
      const requiredDrops = [
        "eye of the duke",
        "leviathan's lure",
        "siren's staff",
        "executioner's axe head",
      ];

      for (const drop of drops) {
        if (requiredDrops.includes(drop.item)) {
          return true;
        }
      }

      return false;
    },
  },
  raids: {
    tierOne: async ({ drops, bosses }: HandlerParams) => {
      const requiredPoints = 250;
      let raidPoints = 0;

      const smallItems = [
        "arcane prayer scroll",
        "dexterous prayer scroll",
        "avernic defender hilt",
        "osmumten's fang",
        "lightbearer",
        "twisted buckler",
      ];
      const bigItems = [
        "masori mask",
        "masori body",
        "masori chaps",
        "eildinis' ward",
        "justiciar faceguard",
        "justiciar chestguard",
        "justiciar lagguard",
        "ghrazi rapier",
        "sanguinesti staff",
        "dragon hunter crossbow",
        "dinh's bulwark",
        "ancestral hat",
        "ancestral robe top",
        "ancestral robe bottom",
        "dragon claws",
        "kodai insignia",
      ];
      const megarareItems = [
        "twisted bow",
        "scyth of vitur",
        "tumeken's shadow",
      ];

      const raidNames = [
        "chambers_of_xeric",
        "chambers_of_xeric_challenge_mode",
        "tombs_of_amascut",
        "tombs_of_amascut_expert",
        "theater_of_blood",
        "theater_of_blood_hard_mode",
      ];

      for (const drop of drops) {
        if (smallItems.includes(drop.item)) {
          raidPoints += 150;
        } else if (bigItems.includes(drop.item)) {
          raidPoints += 300;
        } else if (megarareItems.includes(drop.item)) {
          raidPoints += 1000;
        }
      }

      for (const kc of bosses) {
        if (raidNames.includes(kc.boss)) {
          raidPoints += kc.amount;
        }
      }

      return raidPoints >= requiredPoints;
    },
    tierTwo: async ({ drops, bosses }: HandlerParams) => {
      const requiredPoints = 400;
      let raidPoints = 0;

      const smallItems = [
        "arcane prayer scroll",
        "dexterous prayer scroll",
        "avernic defender hilt",
        "osmumten's fang",
        "lightbearer",
        "twisted buckler",
      ];
      const bigItems = [
        "masori mask",
        "masori body",
        "masori chaps",
        "eildinis' ward",
        "justiciar faceguard",
        "justiciar chestguard",
        "justiciar lagguard",
        "ghrazi rapier",
        "sanguinesti staff",
        "dragon hunter crossbow",
        "dinh's bulwark",
        "ancestral hat",
        "ancestral robe top",
        "ancestral robe bottom",
        "dragon claws",
        "kodai insignia",
      ];
      const megarareItems = [
        "twisted bow",
        "scyth of vitur",
        "tumeken's shadow",
      ];
      const raidNames = [
        "chambers_of_xeric",
        "chambers_of_xeric_challenge_mode",
        "tombs_of_amascut",
        "tombs_of_amascut_expert",
        "theater_of_blood",
        "theater_of_blood_hard_mode",
      ];

      for (const drop of drops) {
        if (smallItems.includes(drop.item)) {
          raidPoints += 150;
        } else if (bigItems.includes(drop.item)) {
          raidPoints += 300;
        } else if (megarareItems.includes(drop.item)) {
          raidPoints += 1000;
        }
      }

      for (const kc of bosses) {
        if (raidNames.includes(kc.boss)) {
          raidPoints += kc.amount;
        }
      }

      return raidPoints >= requiredPoints;
    },
    tierThree: async ({ drops, bosses }: HandlerParams) => {
      const requiredPoints = 1000;
      let raidPoints = 0;

      const smallItems = [
        "arcane prayer scroll",
        "dexterous prayer scroll",
        "avernic defender hilt",
        "osmumten's fang",
        "lightbearer",
        "twisted buckler",
      ];
      const bigItems = [
        "masori mask",
        "masori body",
        "masori chaps",
        "eildinis' ward",
        "justiciar faceguard",
        "justiciar chestguard",
        "justiciar lagguard",
        "ghrazi rapier",
        "sanguinesti staff",
        "dragon hunter crossbow",
        "dinh's bulwark",
        "ancestral hat",
        "ancestral robe top",
        "ancestral robe bottom",
        "dragon claws",
        "kodai insignia",
      ];
      const megarareItems = [
        "twisted bow",
        "scyth of vitur",
        "tumeken's shadow",
      ];
      const raidNames = [
        "chambers_of_xeric",
        "chambers_of_xeric_challenge_mode",
        "tombs_of_amascut",
        "tombs_of_amascut_expert",
        "theater_of_blood",
        "theater_of_blood_hard_mode",
      ];

      for (const drop of drops) {
        if (smallItems.includes(drop.item)) {
          raidPoints += 150;
        } else if (bigItems.includes(drop.item)) {
          raidPoints += 300;
        } else if (megarareItems.includes(drop.item)) {
          raidPoints += 1000;
        }
      }

      for (const kc of bosses) {
        if (raidNames.includes(kc.boss)) {
          raidPoints += kc.amount;
        }
      }

      return raidPoints >= requiredPoints;
    },
  },
  slayer: {
    tierOne: async ({ skills, metadata }: HandlerParams) => {
      const requiredXp = 125_000;
      let totalXp = 0;
      let dropFound = false;

      for (const gains of skills) {
        if (gains.skill === "slayer") {
          totalXp += gains.amount;
        }
      }

      if (
        metadata &&
        metadata["slayer_drop"] &&
        typeof metadata["slayer_drop"] === "boolean"
      ) {
        dropFound = metadata["slayer_drop"];
      }

      return totalXp >= requiredXp && dropFound;
    },
    tierTwo: async ({ skills, drops }: HandlerParams) => {
      const requiredXp = 250_000;
      let totalXp = 0;
      let dropFound = false;

      const headDrops = [
        "abyssal head",
        "araxyte head",
        "alchemical hydra head",
        "basilisk head",
        "cockatrice head",
        "kbd heads",
        "kq head",
        "kurask head",
        "vorkath's head",
      ];

      for (const gains of skills) {
        if (gains.skill === "slayer") {
          totalXp += gains.amount;
        }
      }

      for (const drop of drops) {
        if (headDrops.includes(drop.item)) {
          dropFound = true;
        }
      }

      return totalXp >= requiredXp && dropFound;
    },
    tierThree: async ({ skills, drops }: HandlerParams) => {
      const requiredXp = 300_000;
      let totalXp = 0;
      let dropFound = false;

      const uniqeDrops = [
        "imbued heart",
        "dragon warhammer",
        "basilisk jaw",
        "mist battlestaff",
        "dust battlestaff",
        "eternal gem",
      ];

      for (const gains of skills) {
        if (gains.skill === "slayer") {
          totalXp += gains.amount;
        }
      }

      for (const drop of drops) {
        if (uniqeDrops.includes(drop.item)) {
          dropFound = true;
        }
      }

      return totalXp >= requiredXp && dropFound;
    },
  },
  skilling: {
    tierOne: async ({ metadata }: HandlerParams) => {
      const requiredPoints = 100;
      let contracts = 0,
        deliveries = 0,
        rumors = 0,
        swords = 0;

      if (
        metadata &&
        metadata["contracts"] &&
        typeof metadata["contracts"] === "number"
      ) {
        contracts = metadata["contracts"];
      }
      if (
        metadata &&
        metadata["deliveries"] &&
        typeof metadata["deliveries"] === "number"
      ) {
        deliveries = metadata["deliveries"];
      }
      if (
        metadata &&
        metadata["rumors"] &&
        typeof metadata["rumors"] === "number"
      ) {
        rumors = metadata["rumors"];
      }
      if (
        metadata &&
        metadata["swords"] &&
        typeof metadata["swords"] === "number"
      ) {
        swords = metadata["swords"];
      }

      const points = contracts + deliveries * 2 + rumors * 4 + swords * 6;
      return points >= requiredPoints;
    },
    tierTwo: async ({ metadata, drops }: HandlerParams) => {
      const requiredPoints = 200;
      let contracts = 0,
        deliveries = 0,
        rumors = 0,
        swords = 0;
      let dropsFound = 0;

      if (
        metadata &&
        metadata["contracts"] &&
        typeof metadata["contracts"] === "number"
      ) {
        contracts = metadata["contracts"];
      }
      if (
        metadata &&
        metadata["deliveries"] &&
        typeof metadata["deliveries"] === "number"
      ) {
        deliveries = metadata["deliveries"];
      }
      if (
        metadata &&
        metadata["rumors"] &&
        typeof metadata["rumors"] === "number"
      ) {
        rumors = metadata["rumors"];
      }
      if (
        metadata &&
        metadata["swords"] &&
        typeof metadata["swords"] === "number"
      ) {
        swords = metadata["swords"];
      }

      const guildHunterDrops = [
        "guild hunter headgear",
        "guild hunter top",
        "guild hunter legs",
        "guild hunter boots",
      ];

      for (const drop of drops) {
        if (guildHunterDrops.includes(drop.item)) {
          dropsFound++;
        }
      }

      const points = contracts + deliveries * 2 + rumors * 4 + swords * 6;

      return points >= requiredPoints && dropsFound >= 2;
    },
    tierThree: async ({ metadata, drops }: HandlerParams) => {
      const requiredPoints = 300;
      let contracts = 0,
        deliveries = 0,
        rumors = 0,
        swords = 0;
      let dropFound = false;

      if (
        metadata &&
        metadata["contracts"] &&
        typeof metadata["contracts"] === "number"
      ) {
        contracts = metadata["contracts"];
      }
      if (
        metadata &&
        metadata["deliveries"] &&
        typeof metadata["deliveries"] === "number"
      ) {
        deliveries = metadata["deliveries"];
      }
      if (
        metadata &&
        metadata["rumors"] &&
        typeof metadata["rumors"] === "number"
      ) {
        rumors = metadata["rumors"];
      }
      if (
        metadata &&
        metadata["swords"] &&
        typeof metadata["swords"] === "number"
      ) {
        swords = metadata["swords"];
      }

      for (const drop of drops) {
        if (drop.item === "gnome scarf") {
          dropFound = true;
        }
      }

      const points = contracts + deliveries * 2 + rumors * 4 + swords * 6;
      return points >= requiredPoints && dropFound;
    },
    tierFour: async ({ metadata }: HandlerParams) => {
      const requiredPoints = 400;
      let contracts = 0,
        deliveries = 0,
        rumors = 0,
        swords = 0,
        reputation = 0;

      if (
        metadata &&
        metadata["contracts"] &&
        typeof metadata["contracts"] === "number"
      ) {
        contracts = metadata["contracts"];
      }
      if (
        metadata &&
        metadata["deliveries"] &&
        typeof metadata["deliveries"] === "number"
      ) {
        deliveries = metadata["deliveries"];
      }
      if (
        metadata &&
        metadata["rumors"] &&
        typeof metadata["rumors"] === "number"
      ) {
        rumors = metadata["rumors"];
      }
      if (
        metadata &&
        metadata["swords"] &&
        typeof metadata["swords"] === "number"
      ) {
        swords = metadata["swords"];
      }
      if (
        metadata &&
        metadata["reputation"] &&
        typeof metadata["reputation"] === "number"
      ) {
        reputation = metadata["reputation"];
      }

      const points = contracts + deliveries * 2 + rumors * 4 + swords * 6;
      return points >= requiredPoints && reputation >= 4500;
    },
  },
  rod: {
    tierOne: async ({ drops }: HandlerParams) => {
      for (const drop of drops) {
        if (drop.item === "ancient icon") {
          return true;
        }
      }
      return false;
    },
    tierTwo: async ({ drops }: HandlerParams) => {
      const tridentDrops = ["uncharged trident", "trident of the seas (full)"];
      for (const drop of drops) {
        if (tridentDrops.includes(drop.item)) {
          return true;
        }
      }
      return false;
    },
    tierThree: async ({ drops }: HandlerParams) => {
      for (const drop of drops) {
        if (drop.item === "pharaoh's scepter") {
          return true;
        }
      }
      return false;
    },
  },
};
