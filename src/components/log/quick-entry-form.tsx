"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Plus, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { DatePicker } from "./date-picker";
import { ExerciseRow } from "./exercise-row";
import { CardioRow } from "./cardio-row";

import { quickEntryFormSchema, type QuickEntryFormValues } from "@/lib/validators";
import { WORKOUT_TYPES, MAX_EXERCISES, MAX_CARDIO_ENTRIES } from "@/lib/constants";
import { submitWorkoutLog } from "@/actions/log-actions";

interface QuickEntryFormProps {
  exerciseNames: { name: string; category: string }[];
}

type ExerciseFormEntry = QuickEntryFormValues["exercises"][number];
type CardioFormEntry = QuickEntryFormValues["cardioEntries"][number];

function isCompleteExerciseEntry(
  entry: ExerciseFormEntry
): entry is ExerciseFormEntry & {
  exerciseName: string;
  sets: number;
  weightLbs: number;
  reps: number;
} {
  return (
    Boolean(entry.exerciseName) &&
    typeof entry.sets === "number" &&
    typeof entry.weightLbs === "number" &&
    typeof entry.reps === "number"
  );
}

function isCompleteCardioEntry(
  entry: CardioFormEntry
): entry is CardioFormEntry & {
  cardioType: string;
  durationMin: number;
} {
  return (
    Boolean(entry.cardioType) &&
    typeof entry.durationMin === "number"
  );
}

function getErrorMessage(error: unknown): string | null {
  if (!error || typeof error !== "object") {
    return null;
  }

  if (
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }

  return null;
}

function getArrayErrorMessage(error: unknown): string | null {
  const directMessage = getErrorMessage(error);
  if (directMessage) {
    return directMessage;
  }

  if (error && typeof error === "object" && "root" in error) {
    return getErrorMessage((error as { root?: unknown }).root);
  }

  return null;
}

export function QuickEntryForm({ exerciseNames }: QuickEntryFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<QuickEntryFormValues>({
    resolver: zodResolver(quickEntryFormSchema),
    defaultValues: {
      date: format(new Date(), "yyyy-MM-dd"),
      workoutType: "both",
      bodyWeight: undefined,
      exercises: [{ exerciseName: "", weightLbs: undefined, sets: undefined, reps: undefined }],
      cardioEntries: [{ cardioType: "", durationMin: undefined }],
      notes: "",
    },
  });

  const {
    fields: exerciseFields,
    append: appendExercise,
    remove: removeExercise,
  } = useFieldArray({ control: form.control, name: "exercises" });

  const {
    fields: cardioFields,
    append: appendCardio,
    remove: removeCardio,
  } = useFieldArray({ control: form.control, name: "cardioEntries" });

  const workoutType = form.watch("workoutType");
  const showExercises = workoutType === "exercise_only" || workoutType === "both";
  const showCardio = workoutType === "cardio_only" || workoutType === "both";

  async function onSubmit(data: QuickEntryFormValues) {
    setLoading(true);
    try {
      const cleanExercises = showExercises
        ? data.exercises.filter(isCompleteExerciseEntry)
        : [];
      const cleanCardioEntries = showCardio
        ? data.cardioEntries.filter(isCompleteCardioEntry)
        : [];

      const cleanData = {
        ...data,
        exercises: cleanExercises,
        cardioEntries: cleanCardioEntries,
      };

      await submitWorkoutLog(cleanData);
      toast.success("Workout logged!", {
        description: `${format(new Date(data.date + "T00:00:00"), "EEEE, MMM d")} - ${
          WORKOUT_TYPES.find((t) => t.value === data.workoutType)?.label
        }`,
      });

      form.reset({
        date: format(new Date(), "yyyy-MM-dd"),
        workoutType: "both",
        bodyWeight: undefined,
        exercises: [{ exerciseName: "", weightLbs: undefined, sets: undefined, reps: undefined }],
        cardioEntries: [{ cardioType: "", durationMin: undefined }],
        notes: "",
      });
    } catch {
      toast.error("Failed to log workout. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function onInvalid() {
    toast.error("Please fix the highlighted fields before submitting.");
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-6">
      <Card className="app-surface">
        <CardContent className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Date</label>
            <DatePicker
              date={
                form.watch("date")
                  ? new Date(form.watch("date") + "T00:00:00")
                  : undefined
              }
              onSelect={(d) => {
                if (d) {
                  form.setValue("date", format(d, "yyyy-MM-dd"), {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }
              }}
            />
            {getErrorMessage(form.formState.errors.date) ? (
              <p className="mt-1 text-sm text-destructive">
                {getErrorMessage(form.formState.errors.date)}
              </p>
            ) : null}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Workout Type
            </label>
            <Select
              value={form.watch("workoutType")}
              onValueChange={(val) =>
                form.setValue(
                  "workoutType",
                  val as QuickEntryFormValues["workoutType"],
                  {
                    shouldDirty: true,
                    shouldValidate: true,
                  }
                )
              }
            >
              <SelectTrigger className="cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WORKOUT_TYPES.map((type) => (
                  <SelectItem
                    key={type.value}
                    value={type.value}
                    className="cursor-pointer"
                  >
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getErrorMessage(form.formState.errors.workoutType) ? (
              <p className="mt-1 text-sm text-destructive">
                {getErrorMessage(form.formState.errors.workoutType)}
              </p>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card className="app-surface">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-[family-name:var(--font-barlow-condensed)]">
            Body Weight
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-40">
            <Input
              type="number"
              step="0.1"
              placeholder="lbs"
              {...form.register("bodyWeight", {
                setValueAs: (value) =>
                  value === "" ? undefined : Number(value),
              })}
            />
            {getErrorMessage(form.formState.errors.bodyWeight) ? (
              <p className="mt-1 text-sm text-destructive">
                {getErrorMessage(form.formState.errors.bodyWeight)}
              </p>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {showExercises && (
        <Card className="app-surface">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-[family-name:var(--font-barlow-condensed)]">
              Exercises
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {exerciseFields.map((field, index) => (
              <ExerciseRow
                key={field.id}
                index={index}
                form={form}
                exerciseNames={exerciseNames}
                onRemove={() => removeExercise(index)}
                canRemove={exerciseFields.length > 1}
              />
            ))}
            {exerciseFields.length < MAX_EXERCISES && (
              <>
                <Separator />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendExercise({
                      exerciseName: "",
                      weightLbs: undefined,
                      sets: undefined,
                      reps: undefined,
                    })
                  }
                  className="cursor-pointer"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Exercise
                </Button>
              </>
            )}
            {getArrayErrorMessage(form.formState.errors.exercises) ? (
              <p className="text-sm text-destructive">
                {getArrayErrorMessage(form.formState.errors.exercises)}
              </p>
            ) : null}
          </CardContent>
        </Card>
      )}

      {showCardio && (
        <Card className="app-surface">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-[family-name:var(--font-barlow-condensed)]">
              Cardio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {cardioFields.map((field, index) => (
              <CardioRow
                key={field.id}
                index={index}
                form={form}
                onRemove={() => removeCardio(index)}
                canRemove={cardioFields.length > 1}
              />
            ))}
            {cardioFields.length < MAX_CARDIO_ENTRIES && (
              <>
                <Separator />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendCardio({ cardioType: "", durationMin: undefined })
                  }
                  className="cursor-pointer"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Cardio
                </Button>
              </>
            )}
            {getArrayErrorMessage(form.formState.errors.cardioEntries) ? (
              <p className="text-sm text-destructive">
                {getArrayErrorMessage(form.formState.errors.cardioEntries)}
              </p>
            ) : null}
          </CardContent>
        </Card>
      )}

      <Card className="app-surface">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-[family-name:var(--font-barlow-condensed)]">
            Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="How did it go? Any PRs?"
            {...form.register("notes")}
          />
        </CardContent>
      </Card>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-accent text-accent-foreground hover:bg-accent/90 cursor-pointer"
        size="lg"
      >
        {loading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Save className="mr-2 h-5 w-5" />
        )}
        {loading ? "Saving..." : "Log Workout"}
      </Button>
    </form>
  );
}
