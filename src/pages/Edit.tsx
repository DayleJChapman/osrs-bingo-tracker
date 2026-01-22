import { useState, useEffect } from "react";
import { AuthForm, TaskMetadataForm, TierCompletionForm } from "@/components/edit";
import { getStoredAuth, clearAuth, type TeamAuth } from "@/lib/auth";
import { useTeams, useTaskMetadata, saveTaskMetadata, useTierStates, saveTierState, API_BASE } from "@/hooks";
import type { TaskMetadataMap } from "@/types/metadata";
import type { TaskState } from "@/types";

export function Edit() {
  const [auth, setAuth] = useState<TeamAuth | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"tiers" | "metadata">("metadata");
  const { data: teams, loading: teamsLoading, error: teamsError } = useTeams();
  const { data: metadata, loading: metadataLoading, error: metadataError, refetch: refetchMetadata } = useTaskMetadata(auth?.teamId ?? null);
  const { data: tierStates, loading: tierStatesLoading, error: tierStatesError, refetch: refetchTierStates } = useTierStates(auth?.teamId ?? null);

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

  const handleSaveTierState = async (tierId: number, state: TaskState): Promise<boolean> => {
    if (!auth) return false;
    setSaveError(null);
    const result = await saveTierState(auth.teamId, tierId, state, auth.key);
    if (!result.success) {
      setSaveError(result.error);
      return false;
    }
    refetchTierStates();
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

  if (auth && (metadataError || tierStatesError)) {
    return (
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-red-500">Error loading data: {metadataError || tierStatesError}</div>
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
            Update tier completion and task metadata for your team
          </p>
        </div>

        {auth && currentTeam ? (
          metadataLoading || tierStatesLoading ? (
            <div className="text-slate-600 animate-pulse">Loading data...</div>
          ) : (
            <>
              {saveError && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  Error saving: {saveError}
                </div>
              )}

              {/* Tab Navigation */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setActiveTab("metadata")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "metadata"
                      ? "bg-slate-800 text-white"
                      : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                  }`}
                >
                  Task Metadata
                </button>
                <button
                  onClick={() => setActiveTab("tiers")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "tiers"
                      ? "bg-slate-800 text-white"
                      : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                  }`}
                >
                  Tier Completion
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === "metadata" ? (
                <TaskMetadataForm
                  teamId={auth.teamId}
                  teamName={currentTeam.name}
                  initialData={metadata}
                  onSave={handleSave}
                  onLogout={handleLogout}
                />
              ) : (
                <TierCompletionForm
                  teamId={auth.teamId}
                  teamName={currentTeam.name}
                  tierStates={tierStates || []}
                  onSave={handleSaveTierState}
                  onLogout={handleLogout}
                />
              )}
            </>
          )
        ) : (
          <AuthForm teams={teamsList} onAuthenticated={handleAuthenticated} />
        )}
      </div>
    </div>
  );
}
