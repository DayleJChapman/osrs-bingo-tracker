import { Cron } from "croner";
import { jobs } from "./jobs";

const scheduledJobs = [];
for (const job of jobs) {
  const cronJob = new Cron(
    job.pattern,
    {
      ...job.opts,
    },
    job.fn,
  );
  scheduledJobs.push(cronJob);
}

export { scheduledJobs };
