import { cn } from "@/lib/utils";
import type { TaskName, TaskStateRecord } from "@/types";
import { TASK_LABELS, TASK_TIERS, TASK_POINTS } from "@/types";

type BingoTileProps = {
  taskName: TaskName;
  tierStates: TaskStateRecord[];
  className?: string;
};

export function BingoTile({ taskName, tierStates, className }: BingoTileProps) {
  const totalTiers = TASK_TIERS[taskName];
  const points = TASK_POINTS[taskName];
  const label = TASK_LABELS[taskName];

  if (taskName === "WILDY_BOSSES" || taskName === "RAIDS") {
    // console.log(taskName, tierStates);
  }

  // Count completed tiers
  const completedTiers = tierStates.filter(
    (t) => t.state === "COMPLETE",
  ).length;

  // Calculate earned points
  const earnedPoints = points
    .slice(0, completedTiers)
    .reduce((a, b) => a + b, 0);
  const totalPoints = points.reduce((a, b) => a + b, 0);

  // Determine tile state for styling
  const isFullyComplete = completedTiers === totalTiers;
  const isPartiallyComplete = completedTiers > 0 && !isFullyComplete;
  const isNotStarted = completedTiers === 0;

  return (
    <div
      className={cn(
        "relative p-3 rounded-lg border-2 transition-all duration-200",
        "flex flex-col justify-between min-h-[140px]",
        isFullyComplete && "bg-emerald-900/40 border-emerald-500",
        isPartiallyComplete && "bg-amber-900/30 border-amber-500/70",
        isNotStarted && "bg-slate-800/50 border-slate-600/50",
        className,
      )}
    >
      {/* Task name */}
      <div className="text-sm font-semibold text-slate-100 leading-tight">
        {label}
      </div>

      {/* Tier indicators */}
      <div className="flex gap-1 mt-2">
        {Array.from({ length: totalTiers }, (_, i) => {
          const tier = i + 1;
          const tierState = tierStates.find(
            (t) => t.taskId % 4 === tier || tierStates.indexOf(t) === i,
          );
          const state = tierStates[i]?.state || "INCOMPLETE";

          return (
            <div
              key={tier}
              className={cn(
                "flex-1 h-2 rounded-full transition-colors",
                state === "COMPLETE" && "bg-emerald-500",
                state === "INCOMPLETE" && "bg-slate-500",
                state === "BLOCKED" && "bg-slate-700",
              )}
              title={`Tier ${tier}: ${state} (${points[i]} pts)`}
            />
          );
        })}
      </div>

      {/* Points display */}
      <div className="flex justify-between items-end mt-2">
        <span className="text-xs text-slate-400">
          {completedTiers}/{totalTiers} tiers
        </span>
        <span
          className={cn(
            "text-sm font-bold",
            isFullyComplete && "text-emerald-400",
            isPartiallyComplete && "text-amber-400",
            isNotStarted && "text-slate-500",
          )}
        >
          {earnedPoints}/{totalPoints} pts
        </span>
      </div>

      {/* Full completion badge */}
      {isFullyComplete && (
        <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
          DONE
        </div>
      )}
    </div>
  );
}
