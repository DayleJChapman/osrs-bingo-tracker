import { useState, useMemo } from "react";
import { TeamScoreboard } from "./TeamScoreboard";
import { BingoBoard } from "./BingoBoard";
import { cn } from "@/lib/utils";
import type { Team, TaskStateRecord } from "@/types";
import { mockTeams, mockTaskStates } from "@/lib/mock-scoreboard-data";

type ScoreboardProps = {
  teams?: Team[] | null;
  taskStates?: Map<number, TaskStateRecord[]> | null;
  loading?: boolean;
  error?: string | null;
  useMockData?: boolean;
};

type TabValue = "all" | number;

export function Scoreboard({
  teams: propsTeams,
  taskStates: propsTaskStates,
  loading = false,
  error = null,
  useMockData = false,
}: ScoreboardProps) {
  const [activeTab, setActiveTab] = useState<TabValue>("all");

  // Use mock data if specified or if real data is not available
  const teams = useMockData || !propsTeams ? mockTeams : propsTeams;
  const taskStates =
    useMockData || !propsTaskStates ? mockTaskStates : propsTaskStates;

  // Sort teams by points
  const sortedTeams = useMemo(
    () => [...teams].sort((a, b) => b.points - a.points),
    [teams],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-slate-400 animate-pulse">
          Loading scoreboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  // Build tab items
  const tabs: { value: TabValue; label: string }[] = [
    { value: "all", label: "All Teams" },
    ...sortedTeams.map((team) => ({ value: team.id, label: team.name })),
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">
          BZ Bingo - Scoreboard
        </h1>
        <p className="text-slate-600">
          Track team progress across the bingo competition
        </p>
      </div>

      {/* Team Standings */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <TeamScoreboard teams={teams} />
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-300">
        <nav
          className="flex gap-1 overflow-x-auto"
          aria-label="Bingo board tabs"
        >
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "px-4 py-2 text-sm font-medium whitespace-nowrap rounded-t-lg transition-colors",
                activeTab === tab.value
                  ? "bg-slate-800 text-white"
                  : "text-slate-600 hover:bg-slate-200 hover:text-slate-900",
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Bingo Boards */}
      <div
        className={
          activeTab === "all"
            ? "grid grid-cols-1 lg:grid-cols-2 gap-6"
            : "max-w-xl mx-auto"
        }
      >
        {activeTab === "all"
          ? // Show all teams' boards
            sortedTeams.map((team) => {
              const teamTaskStates = taskStates.get(team.id) || [];
              return (
                <div
                  key={team.id}
                  className="bg-slate-800/50 rounded-xl p-4 border border-slate-700"
                >
                  <BingoBoard
                    taskStates={teamTaskStates}
                    teamName={team.name}
                  />
                </div>
              );
            })
          : // Show selected team's board
            (() => {
              const team = teams.find((t) => t.id === activeTab);
              if (!team) return null;
              return (
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <BingoBoard
                    taskStates={taskStates.get(team.id) || []}
                    teamName={team.name}
                  />
                </div>
              );
            })()}
      </div>
    </div>
  );
}
