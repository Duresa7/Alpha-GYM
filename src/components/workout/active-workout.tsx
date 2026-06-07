"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Pause, Play, Timer, Trophy } from "lucide-react";
import { toast } from "sonner";
import { completeActiveWorkout } from "@/actions/log-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatDateKey } from "@/lib/date";
import type { PlannedWorkout } from "@/types";

interface ActiveWorkoutProps {
  workout: PlannedWorkout;
}

interface ExerciseState {
  itemId: number;
  exerciseName: string;
  target: string | null;
  groupLabel: string | null;
  totalSets: number;
  completedSets: number;
  weight: string;
  reps: string;
}

interface CardioState {
  itemId: number;
  cardioType: string;
  target: string | null;
  groupLabel: string | null;
  durationMin: string;
  completed: boolean;
}

const REST_SECONDS = 90;

function parseTargetSets(target: string | null) {
  if (!target) {
    return 3;
  }

  const setsMatch = target.match(/(\d+)\s*(x|sets?)/i);
  return setsMatch ? Math.max(1, Number(setsMatch[1])) : 3;
}

function formatTimer(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

export function ActiveWorkout({ workout }: ActiveWorkoutProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [notes, setNotes] = useState("");
  const [restRemaining, setRestRemaining] = useState(0);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [exerciseState, setExerciseState] = useState<ExerciseState[]>(() =>
    workout.items
      .filter((item) => item.itemType === "exercise")
      .map((item) => ({
        itemId: item.id,
        exerciseName: item.exerciseName,
        target: item.target,
        groupLabel: item.groupLabel,
        totalSets: parseTargetSets(item.target),
        completedSets: 0,
        weight: "",
        reps: "",
      }))
  );
  const [cardioState, setCardioState] = useState<CardioState[]>(() =>
    workout.items
      .filter((item) => item.itemType === "cardio")
      .map((item) => ({
        itemId: item.id,
        cardioType: item.exerciseName,
        target: item.target,
        groupLabel: item.groupLabel,
        durationMin: "",
        completed: false,
      }))
  );

  useEffect(() => {
    if (restRemaining <= 0 || isTimerPaused) {
      return;
    }

    const interval = window.setInterval(() => {
      setRestRemaining((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isTimerPaused, restRemaining]);

  const progress = useMemo(() => {
    const totalSets = exerciseState.reduce(
      (sum, item) => sum + item.totalSets,
      0
    );
    const completedSets = exerciseState.reduce(
      (sum, item) => sum + item.completedSets,
      0
    );
    const totalCardio = cardioState.length;
    const completedCardio = cardioState.filter((item) => item.completed).length;
    const total = totalSets + totalCardio;
    const completed = completedSets + completedCardio;

    return {
      total,
      completed,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [cardioState, exerciseState]);

  const groupedExercises = useMemo(() => {
    return exerciseState.reduce<Record<string, ExerciseState[]>>((acc, item) => {
      const key = item.groupLabel || "Main Work";
      acc[key] = [...(acc[key] || []), item];
      return acc;
    }, {});
  }, [exerciseState]);

  function updateExercise(
    itemId: number,
    patch: Partial<Pick<ExerciseState, "weight" | "reps">>
  ) {
    setExerciseState((current) =>
      current.map((item) =>
        item.itemId === itemId ? { ...item, ...patch } : item
      )
    );
  }

  function toggleSet(itemId: number, setIndex: number) {
    setExerciseState((current) =>
      current.map((item) => {
        if (item.itemId !== itemId) {
          return item;
        }

        const nextCompleted =
          setIndex < item.completedSets ? setIndex : setIndex + 1;

        if (nextCompleted > item.completedSets) {
          setRestRemaining(REST_SECONDS);
          setIsTimerPaused(false);
        }

        return {
          ...item,
          completedSets: Math.max(0, Math.min(item.totalSets, nextCompleted)),
        };
      })
    );
  }

  function updateCardio(itemId: number, durationMin: string) {
    setCardioState((current) =>
      current.map((item) =>
        item.itemId === itemId ? { ...item, durationMin } : item
      )
    );
  }

  function toggleCardio(itemId: number) {
    setCardioState((current) =>
      current.map((item) =>
        item.itemId === itemId ? { ...item, completed: !item.completed } : item
      )
    );
  }

  function handleComplete() {
    const exercises = exerciseState
      .filter((item) => item.completedSets > 0)
      .map((item) => ({
        exerciseName: item.exerciseName,
        sets: item.completedSets,
        weightLbs: Number(item.weight),
        reps: Number(item.reps),
      }));
    const invalidExercise = exercises.find(
      (item) => !item.weightLbs || !item.reps
    );

    if (invalidExercise) {
      toast.error(`Add weight and reps for ${invalidExercise.exerciseName}.`);
      return;
    }

    const cardioEntries = cardioState
      .filter((item) => item.completed)
      .map((item) => ({
        cardioType: item.cardioType,
        durationMin: Number(item.durationMin),
      }));
    const invalidCardio = cardioEntries.find((item) => !item.durationMin);

    if (invalidCardio) {
      toast.error(`Add minutes for ${invalidCardio.cardioType}.`);
      return;
    }

    startTransition(async () => {
      try {
        const result = await completeActiveWorkout({
          plannedWorkoutId: workout.id,
          title: workout.title,
          date: formatDateKey(new Date()),
          notes,
          exercises,
          cardioEntries,
        });

        if (result.personalRecords.length > 0) {
          toast.success(
            `New PR: ${result.personalRecords[0].exerciseName} ${result.personalRecords[0].newBest}`
          );
        } else {
          toast.success("Workout completed.");
        }

        router.push("/history");
        router.refresh();
      } catch {
        toast.error("Could not complete workout.");
      }
    });
  }

  return (
    <div className="space-y-5">
      <Card className="app-surface sticky top-3 z-20">
        <CardContent className="grid gap-4 p-4 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-muted-foreground">
                {progress.completed} / {progress.total} complete
              </p>
              <Badge variant="outline">{progress.percent}%</Badge>
            </div>
            <div className="h-3 overflow-hidden rounded-sm bg-secondary">
              <div
                className="h-full bg-primary transition-[width] duration-300"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-secondary px-4 py-3">
            <Timer className="h-5 w-5 text-primary" />
            <div>
              <p className="metric-label">Rest Timer</p>
              <p className="text-2xl font-bold font-[family-name:var(--font-barlow-condensed)]">
                {formatTimer(restRemaining)}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setIsTimerPaused((current) => !current)}
              disabled={restRemaining <= 0}
              className="cursor-pointer"
              aria-label={isTimerPaused ? "Resume rest timer" : "Pause rest timer"}
              title={isTimerPaused ? "Resume rest timer" : "Pause rest timer"}
            >
              {isTimerPaused ? (
                <Play className="h-4 w-4" />
              ) : (
                <Pause className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {Object.entries(groupedExercises).map(([groupLabel, items]) => (
        <Card key={groupLabel} className="app-surface">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="flex items-center justify-between gap-3 font-[family-name:var(--font-barlow-condensed)] text-xl">
              {groupLabel}
              {groupLabel !== "Main Work" ? (
                <Badge variant="outline">Superset</Badge>
              ) : null}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-5">
            {items.map((item) => (
              <div
                key={item.itemId}
                className="rounded-md border border-border bg-secondary p-3"
              >
                <div className="grid gap-3 md:grid-cols-[1fr_100px_90px] md:items-end">
                  <div>
                    <p className="text-lg font-semibold">{item.exerciseName}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.target || `${item.totalSets} working sets`}
                    </p>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Weight
                    </label>
                    <Input
                      type="number"
                      step="0.5"
                      value={item.weight}
                      onChange={(event) =>
                        updateExercise(item.itemId, { weight: event.target.value })
                      }
                      className="min-h-11"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Reps
                    </label>
                    <Input
                      type="number"
                      value={item.reps}
                      onChange={(event) =>
                        updateExercise(item.itemId, { reps: event.target.value })
                      }
                      className="min-h-11"
                    />
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {Array.from({ length: item.totalSets }, (_, setIndex) => {
                    const isComplete = setIndex < item.completedSets;

                    return (
                      <Button
                        key={setIndex}
                        type="button"
                        variant={isComplete ? "default" : "outline"}
                        onClick={() => toggleSet(item.itemId, setIndex)}
                        className="min-h-11 cursor-pointer"
                      >
                        {isComplete ? <Check className="h-4 w-4" /> : null}
                        Set {setIndex + 1}
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {cardioState.length > 0 ? (
        <Card className="app-surface">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="font-[family-name:var(--font-barlow-condensed)] text-xl">
              Cardio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-5">
            {cardioState.map((item) => (
              <div
                key={item.itemId}
                className="grid gap-3 rounded-md border border-border bg-secondary p-3 md:grid-cols-[1fr_120px_auto] md:items-end"
              >
                <div>
                  <p className="font-semibold">{item.cardioType}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.target || item.groupLabel || "Conditioning"}
                  </p>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Minutes
                  </label>
                  <Input
                    type="number"
                    value={item.durationMin}
                    onChange={(event) =>
                      updateCardio(item.itemId, event.target.value)
                    }
                    className="min-h-11"
                  />
                </div>
                <Button
                  type="button"
                  variant={item.completed ? "default" : "outline"}
                  onClick={() => toggleCardio(item.itemId)}
                  className="min-h-11 cursor-pointer"
                >
                  {item.completed ? <Check className="h-4 w-4" /> : null}
                  Done
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <Card className="app-surface">
        <CardHeader className="border-b border-border pb-4">
          <CardTitle className="font-[family-name:var(--font-barlow-condensed)] text-xl">
            Finish
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          <Textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Notes, substitutions, or PR context."
          />
          <Button
            type="button"
            onClick={handleComplete}
            disabled={isPending}
            className="min-h-12 w-full cursor-pointer"
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Trophy className="h-5 w-5" />
            )}
            Complete Workout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
