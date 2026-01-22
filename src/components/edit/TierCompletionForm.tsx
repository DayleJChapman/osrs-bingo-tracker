import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TierWithState } from "@/hooks/useTierStates";
import type { TaskState, TaskName } from "@/types";
import { TASK_LABELS, TASK_NAMES } from "@/types";

type TierCompletionFormProps = {
  teamId: number;
  teamName: string;
  tierStates: TierWithState[];
  onSave: (tierId: number, state: TaskState) => Promise<boolean>;
  onLogout: () => void;
};

export function TierCompletionForm({
  teamId,
  teamName,
  tierStates,
  onSave,
  onLogout,
}: TierCompletionFormProps) {
  const [saving, setSaving] = useState<number | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Group tiers by task
  const tiersByTask = new Map<TaskName, TierWithState[]>();
  for (const taskName of TASK_NAMES) {
    tiersByTask.set(taskName, []);
  }
  for (const tier of tierStates) {
    const taskName = tier.task.name as TaskName;
    const existing = tiersByTask.get(taskName) || [];
    existing.push(tier);
    tiersByTask.set(taskName, existing);
  }

  // Sort tiers within each task by tier number
  for (const [taskName, tiers] of tiersByTask) {
    tiersByTask.set(
      taskName,
      tiers.sort((a, b) => a.tier.number - b.tier.number)
    );
  }

  const handleStateChange = async (tierId: number, newState: TaskState) => {
    setSaving(tierId);
    setSaveError(null);
    const success = await onSave(tierId, newState);
    setSaving(null);
    if (!success) {
      setSaveError(`Failed to update tier ${tierId}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Edit Tier Completion
          </h2>
          <p className="text-slate-600">
            Editing for <span className="font-semibold">{teamName}</span>
          </p>
        </div>
        <Button variant="outline" onClick={onLogout}>
          Logout
        </Button>
      </div>

      {saveError && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {saveError}
        </div>
      )}

      {/* Task Sections */}
      <div className="space-y-6">
        {TASK_NAMES.map((taskName) => {
          const tiers = tiersByTask.get(taskName) || [];
          if (tiers.length === 0) return null;

          return (
            <TaskSection
              key={taskName}
              taskName={taskName}
              tiers={tiers}
              saving={saving}
              onStateChange={handleStateChange}
            />
          );
        })}
      </div>
    </div>
  );
}

type TaskSectionProps = {
  taskName: TaskName;
  tiers: TierWithState[];
  saving: number | null;
  onStateChange: (tierId: number, state: TaskState) => void;
};

function TaskSection({ taskName, tiers, saving, onStateChange }: TaskSectionProps) {
  const taskLabel = TASK_LABELS[taskName];

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">{taskLabel}</h3>
      <div className="space-y-4">
        {tiers.map((tier) => (
          <TierRow
            key={tier.tierId}
            tier={tier}
            isSaving={saving === tier.tierId}
            onStateChange={onStateChange}
          />
        ))}
      </div>
    </div>
  );
}

type TierRowProps = {
  tier: TierWithState;
  isSaving: boolean;
  onStateChange: (tierId: number, state: TaskState) => void;
};

function TierRow({ tier, isSaving, onStateChange }: TierRowProps) {
  const stateColors: Record<TaskState, string> = {
    COMPLETE: "text-green-400",
    INCOMPLETE: "text-amber-400",
    BLOCKED: "text-slate-500",
  };

  return (
    <div className="flex items-center justify-between gap-4 p-3 bg-slate-700/50 rounded-lg">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Label className="text-slate-200 font-medium">
            Tier {tier.tier.number}
          </Label>
          <span className="text-sm text-slate-400">
            ({tier.tier.points} pts)
          </span>
        </div>
        {tier.tier.description && (
          <p className="text-xs text-slate-500 mt-1 truncate">
            {tier.tier.description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Select
          value={tier.state}
          onValueChange={(value) => onStateChange(tier.tierId, value as TaskState)}
          disabled={isSaving}
        >
          <SelectTrigger className={`w-[140px] bg-slate-600 border-slate-500 ${stateColors[tier.state]}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="INCOMPLETE" className="text-amber-400">
              Incomplete
            </SelectItem>
            <SelectItem value="COMPLETE" className="text-green-400">
              Complete
            </SelectItem>
            <SelectItem value="BLOCKED" className="text-slate-400">
              Blocked
            </SelectItem>
          </SelectContent>
        </Select>
        {isSaving && (
          <span className="text-xs text-slate-400 animate-pulse">Saving...</span>
        )}
      </div>
    </div>
  );
}
