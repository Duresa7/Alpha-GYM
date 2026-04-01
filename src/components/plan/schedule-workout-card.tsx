"use client";

import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { WorkoutTemplate } from "@/types";

interface ScheduleWorkoutCardProps {
  isPending: boolean;
  scheduledDate: string;
  scheduledNotes: string;
  scheduledTemplateId: string;
  scheduledTitle: string;
  templates: WorkoutTemplate[];
  onCreatePlannedWorkout: () => Promise<void>;
  onScheduleTemplateChange: (value: string) => void;
  onScheduledDateChange: (value: string) => void;
  onScheduledNotesChange: (value: string) => void;
  onScheduledTitleChange: (value: string) => void;
}

export function ScheduleWorkoutCard({
  isPending,
  scheduledDate,
  scheduledNotes,
  scheduledTemplateId,
  scheduledTitle,
  templates,
  onCreatePlannedWorkout,
  onScheduleTemplateChange,
  onScheduledDateChange,
  onScheduledNotesChange,
  onScheduledTitleChange,
}: ScheduleWorkoutCardProps) {
  return (
    <Card className="app-surface">
      <CardHeader>
        <CardTitle className="font-[family-name:var(--font-barlow-condensed)] text-xl">
          Schedule a Workout
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Date</label>
          <Input
            type="date"
            value={scheduledDate}
            onChange={(event) => onScheduledDateChange(event.target.value)}
            disabled={isPending}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Template</label>
          <select
            value={scheduledTemplateId}
            onChange={(event) => onScheduleTemplateChange(event.target.value)}
            disabled={isPending}
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
          >
            <option value="">Custom / free-form</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Title</label>
          <Input
            value={scheduledTitle}
            onChange={(event) => onScheduledTitleChange(event.target.value)}
            disabled={isPending}
            placeholder="Upper A"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Notes</label>
          <Input
            value={scheduledNotes}
            onChange={(event) => onScheduledNotesChange(event.target.value)}
            disabled={isPending}
            placeholder="Optional coaching note"
          />
        </div>
        <div className="md:col-span-2">
          <Button
            type="button"
            onClick={onCreatePlannedWorkout}
            disabled={isPending}
            className="cursor-pointer"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Schedule Workout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
