// Client-side authentication storage for team captains
// Actual password verification happens on the server

const STORAGE_KEY = "osrs-bingo-auth";

export type TeamAuth = {
  teamId: number;
  key: string;
};

export function getStoredAuth(): TeamAuth | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as TeamAuth;
  } catch {
    return null;
  }
}

export function storeAuth(auth: TeamAuth): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
}

export function clearAuth(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasStoredAuth(): boolean {
  return getStoredAuth() !== null;
}
