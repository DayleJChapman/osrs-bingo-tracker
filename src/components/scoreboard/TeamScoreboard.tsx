import { cn } from "@/lib/utils";
import type { Team } from "@/types";

type TeamScoreboardProps = {
  teams: Team[];
};

export function TeamScoreboard({ teams }: TeamScoreboardProps) {
  // Sort teams by points (highest first)
  const sortedTeams = [...teams].sort((a, b) => b.points - a.points);

  // Assign rank colors
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-400"; // Gold
      case 2:
        return "text-slate-300"; // Silver
      case 3:
        return "text-amber-600"; // Bronze
      default:
        return "text-slate-500";
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500/10 border-yellow-500/30";
      case 2:
        return "bg-slate-400/10 border-slate-400/30";
      case 3:
        return "bg-amber-600/10 border-amber-600/30";
      default:
        return "bg-slate-700/30 border-slate-600/30";
    }
  };

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold text-slate-100 mb-4">Team Standings</h2>
      {sortedTeams.map((team, index) => {
        const rank = index + 1;

        return (
          <div
            key={team.id}
            className={cn(
              "flex items-center gap-4 p-4 rounded-lg border-2",
              getRankBg(rank)
            )}
          >
            {/* Rank */}
            <span
              className={cn(
                "text-2xl font-bold w-8 text-center",
                getRankColor(rank)
              )}
            >
              {rank}
            </span>

            {/* Team name */}
            <span className="flex-1 text-left text-lg font-semibold text-slate-100">
              {team.name}
            </span>

            {/* Points */}
            <span
              className={cn(
                "text-2xl font-bold tabular-nums",
                getRankColor(rank)
              )}
            >
              {team.points}
              <span className="text-sm text-slate-400 ml-1">pts</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
