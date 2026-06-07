"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  createPlannedWorkout,
  createWorkoutTemplate,
  duplicateWorkoutTemplate,
} from "@/actions/plan-actions";
import type { PlannedWorkout, WorkoutTemplate } from "@/types";
import { emptyDraftItem, type TemplateDraftItem } from "./plan-workspace-shared";

interface TemplateDraft {
  name: string;
  description: string;
  goalFocus: string;
  duration: string;
}

interface ScheduleDraft {
  date: string;
  templateId: string;
  title: string;
  notes: string;
}

function buildDefaultScheduleDraft(): ScheduleDraft {
  return {
    date: format(new Date(), "yyyy-MM-dd"),
    templateId: "",
    title: "",
    notes: "",
  };
}

function buildDefaultTemplateDraft(): TemplateDraft {
  return {
    name: "",
    description: "",
    goalFocus: "",
    duration: "",
  };
}

export function usePlanWorkspace(
  templates: WorkoutTemplate[],
  plannedWorkouts: PlannedWorkout[]
) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [templateDraft, setTemplateDraft] = useState<TemplateDraft>(
    buildDefaultTemplateDraft()
  );
  const [draftItems, setDraftItems] = useState<TemplateDraftItem[]>([
    emptyDraftItem(),
  ]);
  const [scheduleDraft, setScheduleDraft] = useState<ScheduleDraft>(
    buildDefaultScheduleDraft()
  );

  const groupedWorkouts = useMemo(() => {
    return plannedWorkouts.reduce<Record<string, PlannedWorkout[]>>(
      (acc, workout) => {
        acc[workout.date] = [...(acc[workout.date] || []), workout];
        return acc;
      },
      {}
    );
  }, [plannedWorkouts]);

  function updateTemplateDraft<K extends keyof TemplateDraft>(
    key: K,
    value: TemplateDraft[K]
  ) {
    setTemplateDraft((current) => ({ ...current, [key]: value }));
  }

  function updateScheduleDraft<K extends keyof ScheduleDraft>(
    key: K,
    value: ScheduleDraft[K]
  ) {
    setScheduleDraft((current) => ({ ...current, [key]: value }));
  }

  function updateDraftItem(index: number, patch: Partial<TemplateDraftItem>) {
    setDraftItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      )
    );
  }

  function moveDraftItem(index: number, direction: -1 | 1) {
    setDraftItems((current) => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= current.length) {
        return current;
      }

      const next = [...current];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  }

  function addDraftItem() {
    setDraftItems((current) => [...current, emptyDraftItem()]);
  }

  function resetTemplateDraft() {
    setTemplateDraft(buildDefaultTemplateDraft());
    setDraftItems([emptyDraftItem()]);
  }

  function resetScheduleDraft() {
    setScheduleDraft(buildDefaultScheduleDraft());
  }

  function handleScheduleTemplateChange(value: string) {
    const template = templates.find((entry) => String(entry.id) === value);
    setScheduleDraft((current) => ({
      ...current,
      templateId: value,
      title: template?.name ?? "",
    }));
  }

  async function handleCreateTemplate() {
    if (!templateDraft.name.trim()) {
      toast.error("Template name is required.");
      return;
    }

    const items = draftItems.filter((item) => item.exerciseName.trim());
    if (!items.length) {
      toast.error("Add at least one template item.");
      return;
    }

    startTransition(async () => {
      try {
        await createWorkoutTemplate({
          name: templateDraft.name.trim(),
          description: templateDraft.description.trim(),
          goalFocus: templateDraft.goalFocus.trim(),
          estimatedDurationMin: templateDraft.duration
            ? Number(templateDraft.duration)
            : undefined,
          items: items.map((item) => ({
            itemType: item.itemType,
            exerciseName: item.exerciseName.trim(),
            instruction: item.instruction.trim(),
            target: item.target.trim(),
            section: item.section,
            groupLabel: item.groupLabel.trim(),
            isRequired: item.isRequired,
          })),
        });
        toast.success("Template created.");
        resetTemplateDraft();
        router.refresh();
      } catch {
        toast.error("Failed to create template.");
      }
    });
  }

  async function handleDuplicateTemplate(templateId: number) {
    startTransition(async () => {
      try {
        await duplicateWorkoutTemplate(templateId);
        toast.success("Template duplicated.");
        router.refresh();
      } catch {
        toast.error("Failed to duplicate template.");
      }
    });
  }

  async function handleCreatePlannedWorkout() {
    const template = templates.find(
      (entry) => String(entry.id) === scheduleDraft.templateId
    );
    const title = scheduleDraft.title.trim() || template?.name;

    if (!title) {
      toast.error("Choose a template or enter a title.");
      return;
    }

    startTransition(async () => {
      try {
        await createPlannedWorkout({
          date: scheduleDraft.date,
          templateId: scheduleDraft.templateId
            ? Number(scheduleDraft.templateId)
            : undefined,
          title,
          notes: scheduleDraft.notes.trim(),
          estimatedDurationMin: template?.estimatedDurationMin ?? undefined,
        });
        toast.success("Workout scheduled.");
        resetScheduleDraft();
        router.refresh();
      } catch {
        toast.error("Failed to schedule workout.");
      }
    });
  }

  return {
    isPending,
    draftItems,
    groupedWorkouts,
    scheduleDraft,
    templateDraft,
    addDraftItem,
    handleCreatePlannedWorkout,
    handleCreateTemplate,
    handleDuplicateTemplate,
    handleScheduleTemplateChange,
    moveDraftItem,
    updateDraftItem,
    updateScheduleDraft,
    updateTemplateDraft,
  };
}
