import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { verifyTeamKey, storeAuth, type TeamAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

type AuthFormProps = {
  teams: { id: number; name: string }[];
  onAuthenticated: (auth: TeamAuth) => void;
};

export function AuthForm({ teams, onAuthenticated }: AuthFormProps) {
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [key, setKey] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedTeamId) {
      setError("Please select a team");
      return;
    }

    if (!key.trim()) {
      setError("Please enter your team key");
      return;
    }

    if (verifyTeamKey(selectedTeamId, key)) {
      const auth = { teamId: selectedTeamId, key };
      storeAuth(auth);
      onAuthenticated(auth);
    } else {
      setError("Invalid key for this team");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-slate-100 mb-4">
          Team Captain Login
        </h2>
        <p className="text-slate-400 text-sm mb-6">
          Select your team and enter your captain key to edit task metadata.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Selection */}
          <div className="space-y-2">
            <Label className="text-slate-200">Select Team</Label>
            <div className="grid grid-cols-2 gap-2">
              {teams.map((team) => (
                <button
                  key={team.id}
                  type="button"
                  onClick={() => setSelectedTeamId(team.id)}
                  className={cn(
                    "p-3 rounded-lg border-2 text-sm font-medium transition-colors",
                    selectedTeamId === team.id
                      ? "bg-blue-600 border-blue-500 text-white"
                      : "bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500"
                  )}
                >
                  {team.name}
                </button>
              ))}
            </div>
          </div>

          {/* Key Input */}
          <div className="space-y-2">
            <Label htmlFor="key" className="text-slate-200">
              Captain Key
            </Label>
            <Input
              id="key"
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter your team key"
              className="bg-slate-700 border-slate-600 text-slate-100"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}
