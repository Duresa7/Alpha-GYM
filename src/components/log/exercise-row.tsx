"use client";

import { X } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { QuickEntryFormValues } from "@/lib/validators";
import { ExerciseCombobox } from "./exercise-combobox";

interface ExerciseRowProps {
  index: number;
  form: UseFormReturn<QuickEntryFormValues>;
  exerciseNames: { name: string; category: string }[];
  onRemove: () => void;
  canRemove: boolean;
}

export function ExerciseRow({
  index,
  form,
  exerciseNames,
  onRemove,
  canRemove,
}: ExerciseRowProps) {
  const rowErrors = form.formState.errors.exercises?.[index];

  return (
    <div className="rounded-md border border-border bg-secondary p-3">
      <div className="grid gap-3 sm:grid-cols-[minmax(180px,1fr)_96px_80px_80px_44px] sm:items-start">
        <div className="space-y-1">
          <label className="block text-sm font-medium">Exercise</label>
          <ExerciseCombobox
            exerciseNames={exerciseNames}
            value={form.watch(`exercises.${index}.exerciseName`) ?? ""}
            onChange={(val) =>
              form.setValue(`exercises.${index}.exerciseName`, val, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
          {rowErrors?.exerciseName?.message ? (
            <p className="text-sm text-destructive">
              {rowErrors.exerciseName.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Weight</label>
          <Input
            type="number"
            placeholder="0"
            className="min-h-11"
            {...form.register(`exercises.${index}.weightLbs`, {
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
            })}
          />
          {rowErrors?.weightLbs?.message ? (
            <p className="text-sm text-destructive">
              {rowErrors.weightLbs.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Sets</label>
          <Input
            type="number"
            placeholder="1"
            className="min-h-11"
            {...form.register(`exercises.${index}.sets`, {
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
            })}
          />
          {rowErrors?.sets?.message ? (
            <p className="text-sm text-destructive">{rowErrors.sets.message}</p>
          ) : null}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Reps</label>
          <Input
            type="number"
            placeholder="0"
            className="min-h-11"
            {...form.register(`exercises.${index}.reps`, {
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
            })}
          />
          {rowErrors?.reps?.message ? (
            <p className="text-sm text-destructive">{rowErrors.reps.message}</p>
          ) : null}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          disabled={!canRemove}
          className="min-h-11 cursor-pointer self-end justify-self-start sm:justify-self-end"
          aria-label="Remove exercise"
          title="Remove exercise"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
