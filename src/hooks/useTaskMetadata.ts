import { useState, useEffect, useCallback } from "react";
import { API_BASE } from "./useFetch";
import type { TaskMetadataMap } from "@/types/metadata";
import { DEFAULT_METADATA } from "@/types/metadata";

export type TaskMetadataState = {
  data: TaskMetadataMap;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useTaskMetadata(teamId: number | null): TaskMetadataState {
  const [data, setData] = useState<TaskMetadataMap>(DEFAULT_METADATA);
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
      const response = await fetch(`${API_BASE}/teams/${teamId}/metadata`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      // Merge with defaults to ensure all fields exist
      setData({
        DELVE: { ...DEFAULT_METADATA.DELVE, ...result.DELVE },
        PULLING: { ...DEFAULT_METADATA.PULLING, ...result.PULLING },
        GETTING_HEAD: { ...DEFAULT_METADATA.GETTING_HEAD, ...result.GETTING_HEAD },
        CONTRACT_SKILLER: { ...DEFAULT_METADATA.CONTRACT_SKILLER, ...result.CONTRACT_SKILLER },
      });
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

export type SaveMetadataResult = {
  success: boolean;
  error: string | null;
};

export async function saveTaskMetadata(
  teamId: number,
  authKey: string,
  metadata: TaskMetadataMap
): Promise<SaveMetadataResult> {
  try {
    const response = await fetch(`${API_BASE}/teams/${teamId}/metadata`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authKey}`,
      },
      body: JSON.stringify(metadata),
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
