import type { CronCallback, CronOptions } from "croner";
import { scrapeWOM } from "../wom";
import { scrapeDiscord } from "../drops";
import { updateAllTeamsTasks, verifyPoints } from "../tasks";

interface PollerJob {
  pattern: string | Date;
  fn: CronCallback;
  opts: Omit<CronOptions, "name"> & { name: string };
}

export const jobs: PollerJob[] = [
  {
    pattern: "@hourly",
    opts: { name: "scrape_wom" },
    fn: scrapeWOM,
  },
  {
    pattern: "@hourly",
    opts: { name: "scrape_disord_drops" },
    fn: scrapeDiscord,
  },
  {
    pattern: "*/1 * * * *",
    opts: { name: "check_task_status" },
    fn: async () => {
      await updateAllTeamsTasks();
      await verifyPoints();
    },
  },
] as const;
