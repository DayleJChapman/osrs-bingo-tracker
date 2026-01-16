import { useState } from "react";
import { cn } from "@/lib/utils";
import { mockTaskDetails } from "@/lib/mock-tasks-data";
import { useTaskDetails } from "@/hooks/useTasks";
import type { TaskDetail } from "@/types";

export function Tasks() {
  const { data: taskDetails, loading, error } = useTaskDetails();
  const [selectedTask, setSelectedTask] = useState(taskDetails?.delve);

  if (loading) {
    return (
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-slate-600 animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !taskDetails)
    return (
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-red-500">Error loading teams: {error}</div>
        </div>
      </div>
    );

  return (
    <div className="py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Bingo Tasks</h1>
          <p className="text-slate-600 mt-2">
            View details and requirements for each task
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Task List */}
          <div className="lg:col-span-1 space-y-2">
            <h2 className="text-lg font-semibold text-slate-700 mb-3">
              All Tasks
            </h2>
            {Object.values(taskDetails).map((task) => (
              <button
                key={task.name}
                onClick={() => setSelectedTask(task)}
                className={cn(
                  "w-full text-left p-4 rounded-lg border-2 transition-all",
                  selectedTask?.name === task.name
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-slate-200 text-slate-900 hover:border-slate-400",
                )}
              >
                <div className="font-semibold">{task.label}</div>
                <div
                  className={cn(
                    "text-sm mt-1",
                    selectedTask?.name === task.name
                      ? "text-slate-400"
                      : "text-slate-500",
                  )}
                >
                  {Object.keys(task.tiers).length} tiers |{" "}
                  {Object.values(task.tiers).reduce(
                    (sum, t) => sum + t.points,
                    0,
                  )}{" "}
                  total pts
                </div>
              </button>
            ))}
          </div>

          {/* Task Detail */}
          <div className="lg:col-span-2">
            {selectedTask && <TaskDetailView task={selectedTask} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskDetailView({ task }: { task: TaskDetail }) {
  const totalPoints = Object.values(task.tiers).reduce(
    (sum, t) => sum + t.points,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Task Header */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{task.label}</h2>
            <p className="text-slate-400 mt-2">{task.description}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-emerald-400">
              {totalPoints}
            </div>
            <div className="text-sm text-slate-400">total points</div>
          </div>
        </div>
      </div>

      {/* Tiers */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700">Tiers</h3>
        {Object.entries(task.tiers).map(([i, tier]) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-slate-200 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                    i === "1" && "bg-amber-100 text-amber-700",
                    i === "2" && "bg-slate-200 text-slate-700",
                    i === "3" && "bg-orange-100 text-orange-700",
                    i === "3" && "bg-purple-100 text-purple-700",
                  )}
                >
                  {i}
                </span>
                <span className="font-semibold text-slate-900">Tier {i}</span>
              </div>
              <span className="text-lg font-bold text-emerald-600">
                +{tier.points} pts
              </span>
            </div>

            <p className="text-slate-600 mb-4">{tier.description}</p>

            {tier.requirements.length > 0 && (
              <div>
                <div className="text-sm font-medium text-slate-500 mb-2">
                  Requirements:
                </div>
                <ul className="space-y-1">
                  {tier.requirements.map((req, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-slate-600 flex items-start gap-2"
                    >
                      <span className="text-slate-400 mt-1">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
