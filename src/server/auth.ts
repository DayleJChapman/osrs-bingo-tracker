// Server-side authentication for team captains
// Team passwords are read from environment variables

/**
 * Get the password for a team from environment variables.
 * Environment variable format: TEAM_<ID>_KEY (e.g., TEAM_1_KEY, TEAM_2_KEY)
 */
function getTeamPassword(teamId: number): string | undefined {
  return process.env[`TEAM_${teamId}_KEY`];
}

/**
 * Verify a team's authentication key against the environment variable.
 * Returns true if the key matches the stored password for the team.
 */
export function verifyTeamKey(teamId: number, key: string): boolean {
  const password = getTeamPassword(teamId);
  if (!password) {
    console.warn(`No password configured for team ${teamId}. Set TEAM_${teamId}_KEY environment variable.`);
    return false;
  }
  return password === key;
}
