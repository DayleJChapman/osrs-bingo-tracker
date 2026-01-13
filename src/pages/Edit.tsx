import { useState, useEffect } from "react";
import { AuthForm, TaskMetadataForm } from "@/components/edit";
import { getStoredAuth, clearAuth, verifyTeamKey, type TeamAuth } from "@/lib/auth";
import { useTeams } from "@/hooks";
import type { TaskMetadataMap } from "@/types/metadata";

export function Edit() {
  const [auth, setAuth] = useState<TeamAuth | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const { data: teams, loading: teamsLoading, error: teamsError } = useTeams();

  // Check for existing auth on mount
  useEffect(() => {
    const stored = getStoredAuth();
    if (stored && verifyTeamKey(stored.teamId, stored.key)) {
      setAuth(stored);
    }
    setAuthChecked(true);
  }, []);

  const handleAuthenticated = (newAuth: TeamAuth) => {
    setAuth(newAuth);
  };

  const handleLogout = () => {
    clearAuth();
    setAuth(null);
  };

  const handleSave = (data: TaskMetadataMap) => {
    // In production, this would call the API
    console.log("Saving metadata for team", auth?.teamId, data);
    // TODO: POST /api/teams/:teamId/metadata
  };

  if (!authChecked || teamsLoading) {
    return (
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-slate-600 animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  if (teamsError || !teams) {
    return (
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-red-500">Error loading teams: {teamsError}</div>
        </div>
      </div>
    );
  }

  const teamsList = teams.map((t) => ({ id: t.id, name: t.name }));
  const currentTeam = auth ? teamsList.find((t) => t.id === auth.teamId) : null;

  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Team Captain Edit</h1>
          <p className="text-slate-600 mt-2">
            Update task metadata for your team
          </p>
        </div>

        {auth && currentTeam ? (
          <TaskMetadataForm
            teamId={auth.teamId}
            teamName={currentTeam.name}
            onSave={handleSave}
            onLogout={handleLogout}
          />
        ) : (
          <AuthForm teams={teamsList} onAuthenticated={handleAuthenticated} />
        )}
      </div>
    </div>
  );
}
