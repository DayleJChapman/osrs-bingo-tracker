import { db } from ".";
import { womClient } from "../wom";
import { players, teams } from "./schema";

await Promise.all([db.delete(players), db.delete(teams)]);

const compId = Bun.env["WOM_COMP_ID"];
if (!compId || Number.isNaN(compId))
  throw new Error("Invalid or missing WOM_COMP_ID");

const competition = await womClient.competitions.getCompetitionDetails(
  Number(compId),
);

const teamIdMap = new Map<string, number>();

for (const participant of competition.participations) {
  const teamName = participant.teamName;
  if (!teamName) continue;

  let teamId = teamIdMap.get(teamName);
  if (!teamId) {
    const result = await db
      .insert(teams)
      .values({ name: teamName })
      .returning({ id: teams.id });
    const insertedId = result[0]?.id;
    if (!insertedId) throw new Error("Something went wrong instering team");

    teamId = insertedId;
    teamIdMap.set(teamName, teamId);
  }

  await db.insert(players).values({
    username: participant.player.username,
    displayName: participant.player.displayName,
    womId: participant.playerId,
    teamId,
  });
}

const [teamCount, playerCount] = await Promise.all([
  db.$count(teams),
  db.$count(players),
]);

console.log(`Inserted ${teamCount} records into table "teams"`);
console.log(`Inserted ${playerCount} records into table "players"`);
