import type { TaskDetail, TierDetail } from "@/types";

export type EmbedsFields = {
  name: string;
  value: string | number | boolean;
  inline?: boolean;
};
export type MessageEmbeds = {
  title: string;
  description?: string;
  fields?: EmbedsFields[];
};

export const messageBuilder = {
  tierComplete: ({
    team,
    task,
    tier,
    number,
  }: {
    team: string;
    task: TaskDetail;
    tier: TierDetail;
    number: number;
  }): MessageEmbeds => ({
    title: `Tier complete!`,
    description: `${team} completed a tier!`,
    fields: [
      {
        name: "Task",
        value: task.label,
        inline: true,
      },
      {
        name: "Tier",
        value: number,
        inline: true,
      },
      {
        name: "Points",
        value: tier.points,
        inline: true,
      },
    ],
  }),
};
