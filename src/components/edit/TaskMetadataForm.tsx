import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  EDITABLE_TASKS,
  DEFAULT_METADATA,
  METADATA_LABELS,
  METADATA_DESCRIPTIONS,
  type TaskMetadataMap,
  type EditableTaskName,
} from "@/types/metadata";
import { TASK_LABELS } from "@/types";

type TaskMetadataFormProps = {
  teamId: number;
  teamName: string;
  initialData?: Partial<TaskMetadataMap>;
  onSave: (data: TaskMetadataMap) => void;
  onLogout: () => void;
};

export function TaskMetadataForm({
  teamId,
  teamName,
  initialData = {},
  onSave,
  onLogout,
}: TaskMetadataFormProps) {
  const [metadata, setMetadata] = useState<TaskMetadataMap>({
    DELVE: { ...DEFAULT_METADATA.DELVE, ...initialData.DELVE },
    PULLING: { ...DEFAULT_METADATA.PULLING, ...initialData.PULLING },
    GETTING_HEAD: { ...DEFAULT_METADATA.GETTING_HEAD, ...initialData.GETTING_HEAD },
    CONTRACT_SKILLER: { ...DEFAULT_METADATA.CONTRACT_SKILLER, ...initialData.CONTRACT_SKILLER },
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateField = (
    task: EditableTaskName,
    field: string,
    value: number | boolean
  ) => {
    setMetadata((prev) => ({
      ...prev,
      [task]: {
        ...prev[task],
        [field]: value,
      },
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    onSave(metadata);
    setSaving(false);
    setSaved(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Edit Task Metadata
          </h2>
          <p className="text-slate-600">
            Editing for <span className="font-semibold">{teamName}</span>
          </p>
        </div>
        <Button variant="outline" onClick={onLogout}>
          Logout
        </Button>
      </div>

      {/* Task Forms */}
      <div className="space-y-6">
        {EDITABLE_TASKS.map((taskName) => (
          <TaskSection
            key={taskName}
            taskName={taskName}
            metadata={metadata}
            updateField={updateField}
          />
        ))}
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save All Changes"}
        </Button>
        {saved && (
          <span className="text-green-600 text-sm">Changes saved successfully!</span>
        )}
      </div>
    </div>
  );
}

type TaskSectionProps = {
  taskName: EditableTaskName;
  metadata: TaskMetadataMap;
  updateField: (
    task: EditableTaskName,
    field: string,
    value: number | boolean
  ) => void;
};

function TaskSection({ taskName, metadata, updateField }: TaskSectionProps) {
  const taskLabel = TASK_LABELS[taskName];
  const taskData = metadata[taskName];

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">{taskLabel}</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {Object.entries(taskData).map(([field, value]) => (
          <FieldInput
            key={field}
            taskName={taskName}
            field={field}
            value={value}
            onChange={(newValue) => updateField(taskName, field, newValue)}
          />
        ))}
      </div>
    </div>
  );
}

type FieldInputProps = {
  taskName: EditableTaskName;
  field: string;
  value: number | boolean;
  onChange: (value: number | boolean) => void;
};

function FieldInput({ taskName, field, value, onChange }: FieldInputProps) {
  const label = METADATA_LABELS[field] || field;
  const description = METADATA_DESCRIPTIONS[field];
  const isBoolean = typeof value === "boolean";

  return (
    <div className="space-y-1">
      <Label className="text-slate-200">{label}</Label>
      {isBoolean ? (
        <div className="flex items-center gap-3 py-2">
          <Switch
            checked={value}
            onCheckedChange={(checked) => onChange(checked)}
          />
          <span className="text-sm text-slate-400">
            {value ? "Yes" : "No"}
          </span>
        </div>
      ) : (
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          min={0}
          className="bg-slate-700 border-slate-600 text-slate-100"
        />
      )}
      {description && (
        <p className="text-xs text-slate-500">{description}</p>
      )}
    </div>
  );
}
