import { useState, useEffect, useCallback } from "react";
import { API_BASE } from "./useFetch";
import type { Team, TaskStateRecord } from "@/types";

export function useScoreboardData(): {
  teams: Team[] | null;
  taskStates: Map<number, TaskStateRecord[]> | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const [teams, setTeams] = useState<Team[] | null>(null);
  const [taskStates, setTaskStates] = useState<Map<
    number,
    TaskStateRecord[]
  > | null>(null);
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
      setTeams(teamsData);

      // Fetch tasks for all teams in parallel
      const taskResponses = await Promise.all(
        teamsData.map((team) =>
          fetch(`${API_BASE}/teams/${team.id}/tasks`).then((r) => r.json())
        )
      );

      const taskMap = new Map<number, TaskStateRecord[]>();
      teamsData.forEach((team, index) => {
        taskMap.set(team.id, taskResponses[index]);
      });
      setTaskStates(taskMap);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { teams, taskStates, loading, error, refetch: fetchData };
}
