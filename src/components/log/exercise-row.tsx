"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ExerciseCombobox } from "./exercise-combobox";
import type { UseFormReturn } from "react-hook-form";
import type { QuickEntryFormValues } from "@/lib/validators";

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
    <div className="flex items-start gap-2">
      <div className="flex-1 space-y-1">
        {index === 0 && (
          <label className="mb-1.5 block text-sm text-muted-foreground">
            Exercise
          </label>
        )}
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
      <div className="w-28 space-y-1">
        {index === 0 && (
          <label className="mb-1.5 block text-sm text-muted-foreground">
            Weight (lbs)
          </label>
        )}
        <Input
          type="number"
          placeholder="0"
          {...form.register(`exercises.${index}.weightLbs`, {
            setValueAs: (value) =>
              value === "" ? undefined : Number(value),
          })}
        />
        {rowErrors?.weightLbs?.message ? (
          <p className="text-sm text-destructive">
            {rowErrors.weightLbs.message}
          </p>
        ) : null}
      </div>
      <div className="w-20 space-y-1">
        {index === 0 && (
          <label className="mb-1.5 block text-sm text-muted-foreground">
            Sets
          </label>
        )}
        <Input
          type="number"
          placeholder="1"
          {...form.register(`exercises.${index}.sets`, {
            setValueAs: (value) =>
              value === "" ? undefined : Number(value),
          })}
        />
        {rowErrors?.sets?.message ? (
          <p className="text-sm text-destructive">
            {rowErrors.sets.message}
          </p>
        ) : null}
      </div>
      <div className="w-20 space-y-1">
        {index === 0 && (
          <label className="mb-1.5 block text-sm text-muted-foreground">
            Reps
          </label>
        )}
        <Input
          type="number"
          placeholder="0"
          {...form.register(`exercises.${index}.reps`, {
            setValueAs: (value) =>
              value === "" ? undefined : Number(value),
          })}
        />
        {rowErrors?.reps?.message ? (
          <p className="text-sm text-destructive">
            {rowErrors.reps.message}
          </p>
        ) : null}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        disabled={!canRemove}
        className="mt-6 cursor-pointer shrink-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
