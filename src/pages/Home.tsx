import { Scoreboard } from "@/components/scoreboard";
import { useScoreboardData } from "@/hooks";

export function Home() {
  const { teams, taskStates, loading, error, refetch } = useScoreboardData();
  console.log(taskStates);

  return (
    <div className="py-8 px-4">
      <Scoreboard
        teams={teams}
        taskStates={taskStates}
        loading={loading}
        error={error}
        useMockData={!teams || teams.length === 0}
      />

      {/* Refresh button */}
      <div className="fixed bottom-4 right-4">
        <button
          onClick={refetch}
          className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg shadow-lg transition-colors"
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>
    </div>
  );
}
