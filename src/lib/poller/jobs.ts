import type { CronCallback, CronOptions } from "croner";
import { scrapeWOM } from "../wom";
import { scrapeDiscord } from "../drops";

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
] as const;
