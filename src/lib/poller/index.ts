import { Cron } from "croner";
import { jobs } from "./jobs";

for (const job of jobs) {
  new Cron(job.pattern, job.opts, job.fn);
}
