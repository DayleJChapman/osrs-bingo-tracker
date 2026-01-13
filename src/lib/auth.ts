// Simple key-based authentication for team captains
// Each team has a unique key pair (public ID + private secret)

const STORAGE_KEY = "osrs-bingo-auth";

export type TeamAuth = {
  teamId: number;
  key: string;
};

// In production, these would be stored securely on the server
// For now, we use a simple hash-based system
const TEAM_KEYS: Record<number, { publicId: string; secretHash: string }> = {
  1: { publicId: "team1", secretHash: hashKey("iron-titans-secret-2024") },
  2: { publicId: "team2", secretHash: hashKey("zamorak-chosen-secret-2024") },
  3: { publicId: "team3", secretHash: hashKey("lumbridge-legends-secret-2024") },
  4: { publicId: "team4", secretHash: hashKey("varrock-veterans-secret-2024") },
};

// Simple hash function for demo purposes
// In production, use proper crypto hashing on the server
function hashKey(key: string): string {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

export function verifyTeamKey(teamId: number, key: string): boolean {
  const teamConfig = TEAM_KEYS[teamId];
  if (!teamConfig) return false;
  return teamConfig.secretHash === hashKey(key);
}

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

export function isAuthenticated(teamId: number): boolean {
  const auth = getStoredAuth();
  if (!auth) return false;
  return auth.teamId === teamId && verifyTeamKey(teamId, auth.key);
}
