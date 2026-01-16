import { useState, useEffect, useCallback } from "react";
import { useFetch, API_BASE, type FetchState } from "./useFetch";
import type { TaskList, TaskStateRecord } from "@/types";

export function useTeamTasks(teamId: number): FetchState<TaskStateRecord[]> {
  return useFetch<TaskStateRecord[]>(`${API_BASE}/teams/${teamId}/tasks`);
}

export function useTaskDetails(): {
  data: TaskList | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const [data, setData] = useState<TaskList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log(`${API_BASE}/tasks`);
      const res = await fetch(`${API_BASE}/tasks`);
      setData((await res.json()) as TaskList);
    } catch (err) {
      console.error(err);
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

export function useAllTeamTasks(): {
  data: Map<number, TaskStateRecord[]> | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const [data, setData] = useState<Map<number, TaskStateRecord[]> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch tasks for all 4 teams in parallel
      const teamIds = [1, 2, 3, 4];
      const responses = await Promise.all(
        teamIds.map((id) =>
          fetch(`${API_BASE}/teams/${id}/tasks`).then((r) => r.json()),
        ),
      );

      const taskMap = new Map<number, TaskStateRecord[]>();
      teamIds.forEach((id, index) => {
        taskMap.set(id, responses[index]);
      });

      setData(taskMap);
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
