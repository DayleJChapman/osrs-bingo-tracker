import { useState, useEffect, useCallback } from "react";
import { API_BASE } from "./useFetch";
import type { TaskState, TaskName } from "@/types";

export type TierWithState = {
  id: number;
  taskId: number;
  tierId: number;
  teamId: number;
  state: TaskState;
  tier: {
    id: number;
    taskId: number;
    number: number;
    description: string;
    points: number;
    requirements: string[];
  };
  task: {
    id: number;
    name: TaskName;
    label: string;
    description: string;
  };
};

export type TierStatesState = {
  data: TierWithState[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useTierStates(teamId: number | null): TierStatesState {
  const [data, setData] = useState<TierWithState[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (teamId === null) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/teams/${teamId}/tasks`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export type SaveTierStateResult = {
  success: boolean;
  error: string | null;
};

export async function saveTierState(
  teamId: number,
  tierId: number,
  state: TaskState,
  authKey: string
): Promise<SaveTierStateResult> {
  try {
    const response = await fetch(`${API_BASE}/teams/${teamId}/tiers/${tierId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authKey}`,
      },
      body: JSON.stringify({ state }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return { success: true, error: null };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
