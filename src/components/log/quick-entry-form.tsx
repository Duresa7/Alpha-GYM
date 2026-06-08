"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarPlus2, Loader2, Plus, Save, SkipForward } from "lucide-react";
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
import {
  quickEntryFormSchema,
  type QuickEntryFormValues,
} from "@/lib/validators";
import { parseDateKey } from "@/lib/date";
import {
  MAX_CARDIO_ENTRIES,
  MAX_EXERCISES,
  PLAN_COMPLETION_MODES,
  SKIP_REASONS,
  WORKOUT_TYPES,
} from "@/lib/constants";
import { submitWorkoutLog } from "@/actions/log-actions";
import { carryForwardPlannedWorkout, skipPlannedWorkout } from "@/actions/plan-actions";
import type { PlannedWorkout } from "@/types";

interface QuickEntryFormProps {
  exerciseNames: { name: string; category: string; trackingMode: string }[];
  plannedWorkouts: PlannedWorkout[];
  initialPlannedWorkoutId?: number;
}

type ExerciseFormEntry = QuickEntryFormValues["exercises"][number];
type CardioFormEntry = QuickEntryFormValues["cardioEntries"][number];

function emptyExercise() {
  return {
    exerciseName: "",
    weightLbs: undefined,
    sets: undefined,
    reps: undefined,
  };
}

function emptyCardio() {
  return {
    cardioType: "",
    durationMin: undefined,
  };
}

function buildDefaults(workout?: PlannedWorkout): QuickEntryFormValues {
  const exerciseItems =
    workout?.items
      .filter((item) => item.itemType === "exercise")
      .map((item) => ({
        exerciseName: item.exerciseName,
        weightLbs: undefined,
        sets: undefined,
        reps: undefined,
      })) || [];

  const cardioItems =
    workout?.items
      .filter((item) => item.itemType === "cardio")
      .map((item) => ({
        cardioType: item.exerciseName,
        durationMin: undefined,
      })) || [];

  const workoutType =
    exerciseItems.length > 0 && cardioItems.length > 0
      ? "both"
      : exerciseItems.length > 0
        ? "exercise_only"
        : cardioItems.length > 0
          ? "cardio_only"
          : "rest_day";

  return {
    date: format(new Date(), "yyyy-MM-dd"),
    sessionTitle: workout?.title || "",
    plannedWorkoutId: workout?.id,
    planCompletionMode: workout ? "completed" : "unplanned",
    workoutType,
    bodyWeight: undefined,
    exercises: exerciseItems.length ? exerciseItems : [emptyExercise()],
    cardioEntries: cardioItems.length ? cardioItems : [emptyCardio()],
    notes: "",
  };
}

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
  return Boolean(entry.cardioType) && typeof entry.durationMin === "number";
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

export function QuickEntryForm({
  exerciseNames,
  plannedWorkouts,
  initialPlannedWorkoutId,
}: QuickEntryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [planActionLoading, setPlanActionLoading] = useState(false);
  const [skipReason, setSkipReason] = useState<string>(SKIP_REASONS[0]);

  const initialWorkout = useMemo(
    () => plannedWorkouts.find((entry) => entry.id === initialPlannedWorkoutId),
    [initialPlannedWorkoutId, plannedWorkouts]
  );

  const form = useForm<QuickEntryFormValues>({
    resolver: zodResolver(quickEntryFormSchema),
    defaultValues: buildDefaults(initialWorkout),
  });

  const {
    fields: exerciseFields,
    append: appendExercise,
    remove: removeExercise,
    replace: replaceExercises,
  } = useFieldArray({ control: form.control, name: "exercises" });

  const {
    fields: cardioFields,
    append: appendCardio,
    remove: removeCardio,
    replace: replaceCardio,
  } = useFieldArray({ control: form.control, name: "cardioEntries" });

  const selectedPlannedWorkoutId = form.watch("plannedWorkoutId");
  const selectedWorkout = plannedWorkouts.find(
    (entry) => entry.id === selectedPlannedWorkoutId
  );

  const workoutType = form.watch("workoutType");
  const showExercises = workoutType === "exercise_only" || workoutType === "both";
  const showCardio = workoutType === "cardio_only" || workoutType === "both";

  function applyPlannedWorkout(workoutId?: number) {
    const workout = plannedWorkouts.find((entry) => entry.id === workoutId);
    const defaults = buildDefaults(workout);

    form.setValue("plannedWorkoutId", defaults.plannedWorkoutId, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue("sessionTitle", defaults.sessionTitle, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue("planCompletionMode", defaults.planCompletionMode, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue("workoutType", defaults.workoutType, {
      shouldDirty: true,
      shouldValidate: true,
    });
    replaceExercises(defaults.exercises);
    replaceCardio(defaults.cardioEntries);
  }

  async function runPlanAction(action: () => Promise<unknown>, successMessage: string) {
    setPlanActionLoading(true);
    try {
      await action();
      toast.success(successMessage);
      router.refresh();
      applyPlannedWorkout(undefined);
    } catch {
      toast.error("Could not update the selected planned workout.");
    } finally {
      setPlanActionLoading(false);
    }
  }

  async function onSubmit(data: QuickEntryFormValues) {
    setLoading(true);
    try {
      const cleanExercises = showExercises
        ? data.exercises.filter(isCompleteExerciseEntry)
        : [];
      const cleanCardioEntries = showCardio
        ? data.cardioEntries.filter(isCompleteCardioEntry)
        : [];

      const result = await submitWorkoutLog({
        ...data,
        exercises: cleanExercises,
        cardioEntries: cleanCardioEntries,
        planCompletionMode: data.plannedWorkoutId
          ? data.planCompletionMode
          : "unplanned",
      });

      if (result.personalRecords.length > 0) {
        const firstRecord = result.personalRecords[0];
        toast.success(
          `New PR: ${firstRecord.exerciseName} ${firstRecord.newBest}`
        );
      } else {
        toast.success("Workout logged.");
      }
      form.reset(buildDefaults(undefined));
      router.refresh();
    } catch {
      toast.error("Failed to log workout. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, () =>
        toast.error("Please fix the highlighted fields before submitting.")
      )}
      className="space-y-6"
    >
      <Card className="app-surface">
        <CardContent className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Date</label>
            <DatePicker
              date={
                form.watch("date")
                  ? parseDateKey(form.watch("date"))
                  : undefined
              }
              onSelect={(date) => {
                if (date) {
                  form.setValue("date", format(date, "yyyy-MM-dd"), {
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
            <label className="mb-1.5 block text-sm font-medium">Start From Plan</label>
            <Select
              value={selectedPlannedWorkoutId ? String(selectedPlannedWorkoutId) : "free"}
              onValueChange={(value) =>
                applyPlannedWorkout(value === "free" ? undefined : Number(value))
              }
            >
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder="Free workout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free" className="cursor-pointer">
                  Free workout
                </SelectItem>
                {plannedWorkouts.map((workout) => (
                  <SelectItem
                    key={workout.id}
                    value={String(workout.id)}
                    className="cursor-pointer"
                  >
                    {workout.title} ({workout.date})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Workout Type</label>
            <Select
              value={form.watch("workoutType")}
              onValueChange={(value) =>
                form.setValue("workoutType", value as QuickEntryFormValues["workoutType"], {
                  shouldDirty: true,
                  shouldValidate: true,
                })
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
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Session Title</label>
            <Input
              value={form.watch("sessionTitle") || ""}
              onChange={(event) =>
                form.setValue("sessionTitle", event.target.value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              placeholder="Optional title"
            />
          </div>
        </CardContent>
      </Card>

      {selectedWorkout ? (
        <Card className="app-surface">
          <CardHeader className="border-b border-border pb-3">
            <CardTitle className="text-base font-[family-name:var(--font-barlow-condensed)]">
              Planned Workout
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border border-border bg-secondary p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-semibold">{selectedWorkout.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedWorkout.date}
                    {selectedWorkout.estimatedDurationMin
                      ? ` • ${selectedWorkout.estimatedDurationMin} min`
                      : ""}
                  </p>
                </div>
                <Select
                  value={form.watch("planCompletionMode")}
                  onValueChange={(value) =>
                    form.setValue(
                      "planCompletionMode",
                      value as QuickEntryFormValues["planCompletionMode"],
                      {
                        shouldDirty: true,
                        shouldValidate: true,
                      }
                    )
                  }
                >
                  <SelectTrigger className="w-full cursor-pointer sm:w-[220px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PLAN_COMPLETION_MODES.filter((mode) => mode.value !== "unplanned").map(
                      (mode) => (
                        <SelectItem
                          key={mode.value}
                          value={mode.value}
                          className="cursor-pointer"
                        >
                          {mode.label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {selectedWorkout.items.map((item) => (
                  <span
                    key={item.id}
                    className="rounded-md border border-border bg-card px-3 py-1.5 text-xs"
                  >
                    {item.exerciseName}
                    {item.target ? ` • ${item.target}` : ""}
                    {!item.isRequired ? " • optional" : ""}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
              <select
                value={skipReason}
                onChange={(event) => setSkipReason(event.target.value)}
                disabled={planActionLoading}
                className="flat-field"
              >
                {SKIP_REASONS.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  runPlanAction(
                    () => skipPlannedWorkout(selectedWorkout.id, skipReason),
                    "Workout skipped."
                  )
                }
                disabled={planActionLoading}
                className="cursor-pointer"
              >
                {planActionLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <SkipForward className="mr-2 h-4 w-4" />
                )}
                Skip
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  runPlanAction(
                    () => carryForwardPlannedWorkout(selectedWorkout.id),
                    "Workout moved to tomorrow."
                  )
                }
                disabled={planActionLoading}
                className="cursor-pointer"
              >
                <CalendarPlus2 className="mr-2 h-4 w-4" />
                Move to Tomorrow
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card className="app-surface">
        <CardHeader className="border-b border-border pb-3">
          <CardTitle className="text-base font-[family-name:var(--font-barlow-condensed)]">
            Body Weight
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-xs">
            <Input
              type="number"
              step="0.1"
              placeholder="lbs"
              {...form.register("bodyWeight", {
                setValueAs: (value) => (value === "" ? undefined : Number(value)),
              })}
            />
          </div>
        </CardContent>
      </Card>

      {showExercises ? (
        <Card className="app-surface">
          <CardHeader className="border-b border-border pb-3">
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
            {exerciseFields.length < MAX_EXERCISES ? (
              <>
                <Separator />
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => appendExercise(emptyExercise())}
                  className="min-h-11 cursor-pointer"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Exercise
                </Button>
              </>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {showCardio ? (
        <Card className="app-surface">
          <CardHeader className="border-b border-border pb-3">
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
            {cardioFields.length < MAX_CARDIO_ENTRIES ? (
              <>
                <Separator />
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => appendCardio(emptyCardio())}
                  className="min-h-11 cursor-pointer"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Cardio
                </Button>
              </>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      <Card className="app-surface">
        <CardHeader className="border-b border-border pb-3">
          <CardTitle className="text-base font-[family-name:var(--font-barlow-condensed)]">
            Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Energy, substitutions, PRs, or anything worth remembering."
            {...form.register("notes")}
          />
        </CardContent>
      </Card>

      <Button
        type="submit"
        disabled={loading}
        className="min-h-12 w-full cursor-pointer bg-accent text-accent-foreground hover:bg-accent/90"
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
