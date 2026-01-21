import { useState, useEffect } from "react";
import { AuthForm, TaskMetadataForm } from "@/components/edit";
import { getStoredAuth, clearAuth, type TeamAuth } from "@/lib/auth";
import { useTeams, useTaskMetadata, saveTaskMetadata, API_BASE } from "@/hooks";
import type { TaskMetadataMap } from "@/types/metadata";

export function Edit() {
  const [auth, setAuth] = useState<TeamAuth | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { data: teams, loading: teamsLoading, error: teamsError } = useTeams();
  const { data: metadata, loading: metadataLoading, error: metadataError, refetch: refetchMetadata } = useTaskMetadata(auth?.teamId ?? null);

  // Check for existing auth on mount
  useEffect(() => {
    const verifyStoredAuth = async () => {
      const stored = getStoredAuth();
      if (stored) {
        try {
          const response = await fetch(`${API_BASE}/teams/${stored.teamId}/verify-auth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: stored.key }),
          });
          const result = await response.json();
          if (result.valid) {
            setAuth(stored);
          } else {
            clearAuth();
          }
        } catch {
          // On error, clear stored auth to be safe
          clearAuth();
        }
      }
      setAuthChecked(true);
    };
    verifyStoredAuth();
  }, []);

  const handleAuthenticated = (newAuth: TeamAuth) => {
    setAuth(newAuth);
  };

  const handleLogout = () => {
    clearAuth();
    setAuth(null);
    setSaveError(null);
  };

  const handleSave = async (data: TaskMetadataMap): Promise<boolean> => {
    if (!auth) return false;
    setSaveError(null);
    const result = await saveTaskMetadata(auth.teamId, auth.key, data);
    if (!result.success) {
      setSaveError(result.error);
      return false;
    }
    refetchMetadata();
    return true;
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

  if (auth && metadataError) {
    return (
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-red-500">Error loading metadata: {metadataError}</div>
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
          metadataLoading ? (
            <div className="text-slate-600 animate-pulse">Loading task metadata...</div>
          ) : (
            <>
              {saveError && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  Error saving: {saveError}
                </div>
              )}
              <TaskMetadataForm
                teamId={auth.teamId}
                teamName={currentTeam.name}
                initialData={metadata}
                onSave={handleSave}
                onLogout={handleLogout}
              />
            </>
          )
        ) : (
          <AuthForm teams={teamsList} onAuthenticated={handleAuthenticated} />
        )}
      </div>
    </div>
  );
}
