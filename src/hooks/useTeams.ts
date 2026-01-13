import { useState, useEffect, useCallback } from "react";
import { useFetch, API_BASE, type FetchState } from "./useFetch";
import type { Team, TeamWithMembers } from "@/types";

export function useTeams(): FetchState<Team[]> {
  return useFetch<Team[]>(`${API_BASE}/teams`);
}

export function useTeamsWithMembers(): FetchState<TeamWithMembers[]> {
  const [data, setData] = useState<TeamWithMembers[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch teams first
      const teamsResponse = await fetch(`${API_BASE}/teams`);
      if (!teamsResponse.ok) {
        throw new Error(`Failed to fetch teams: ${teamsResponse.status}`);
      }
      const teamsData: Team[] = await teamsResponse.json();

      // Fetch members for each team in parallel
      const membersResponses = await Promise.all(
        teamsData.map((team) =>
          fetch(`${API_BASE}/teams/${team.id}/members`).then((r) => r.json())
        )
      );

      const teamsWithMembers: TeamWithMembers[] = teamsData.map((team, index) => ({
        ...team,
        members: membersResponses[index]?.members || [],
      }));

      setData(teamsWithMembers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
