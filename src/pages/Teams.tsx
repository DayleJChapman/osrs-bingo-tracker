import { useTeamsWithMembers } from "@/hooks";
import { cn } from "@/lib/utils";
import type { TeamWithMembers } from "@/types";
import { Crown } from "lucide-react";

export function Teams() {
  const { data: teams, loading, error } = useTeamsWithMembers();

  if (loading) {
    return (
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-slate-600 animate-pulse">Loading teams...</div>
        </div>
      </div>
    );
  }

  if (error || !teams) {
    return (
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-red-500">Error loading teams: {error}</div>
        </div>
      </div>
    );
  }

  // Sort teams by points
  const sortedTeams = [...teams].sort((a, b) => b.points - a.points);

  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Teams</h1>
          <p className="text-slate-600 mt-2">
            View all teams and their members
          </p>
        </div>

        {/* Teams Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {sortedTeams.map((team, index) => (
            <TeamCard key={team.id} team={team} rank={index + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TeamCard({ team, rank }: { team: TeamWithMembers; rank: number }) {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-yellow-500/20 to-yellow-600/10 border-yellow-500/50";
      case 2:
        return "from-slate-400/20 to-slate-500/10 border-slate-400/50";
      case 3:
        return "from-amber-600/20 to-amber-700/10 border-amber-600/50";
      default:
        return "from-slate-700/20 to-slate-800/10 border-slate-600/50";
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500 text-yellow-950";
      case 2:
        return "bg-slate-400 text-slate-950";
      case 3:
        return "bg-amber-600 text-amber-950";
      default:
        return "bg-slate-600 text-slate-100";
    }
  };

  return (
    <div
      className={cn(
        "rounded-xl border-2 bg-gradient-to-br overflow-hidden",
        getRankColor(rank),
      )}
    >
      {/* Team Header */}
      <div className="bg-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
              getRankBadgeColor(rank),
            )}
          >
            {rank}
          </span>
          <h3 className="text-xl font-bold text-white">{team.name}</h3>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-emerald-400">
            {team.points}
          </div>
          <div className="text-xs text-slate-400">points</div>
        </div>
      </div>

      {/* Team Members */}
      <div className="p-4">
        <div className="text-sm font-medium text-slate-600 mb-3">
          Members ({team.members.length})
        </div>
        {team.members.length > 0 ? (
          <div className="space-y-2">
            {team.members
              .sort((m) => (m.isTeamCaptain ? -1 : 1))
              .map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 bg-white/50 rounded-lg p-3"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-slate-600 font-medium text-sm">
                    {member.displayName.charAt(0).toUpperCase()}
                  </div>
                  {member.isTeamCaptain && <TeamCaptainBadge />}
                  <div className="font-medium text-slate-900">
                    {member.displayName}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-slate-500 text-sm italic">No members found</div>
        )}
      </div>
    </div>
  );
}

const TeamCaptainBadge = () => (
  <div className="text-sm">
    <Crown size={18} color="gold" />
  </div>
);
