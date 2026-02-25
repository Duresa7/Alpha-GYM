import { z } from "zod";

export const workoutTypeEnum = z.enum([
  "exercise_only",
  "cardio_only",
  "both",
  "weight_only",
  "rest_day",
]);

const optionalWeightSchema = z.number().min(0, "Weight must be positive").optional();

const optionalSetsSchema = z
  .number()
  .int("Sets must be a whole number")
  .min(1, "Sets must be at least 1")
  .optional();

const optionalRepsSchema = z
  .number()
  .int("Reps must be a whole number")
  .min(1, "Reps must be at least 1")
  .optional();

const optionalDurationSchema = z
  .number()
  .int("Duration must be a whole number")
  .min(1, "Duration must be at least 1 minute")
  .optional();

export const exerciseEntrySchema = z
  .object({
    exerciseName: z.string().trim().optional(),
    weightLbs: optionalWeightSchema,
    sets: optionalSetsSchema,
    reps: optionalRepsSchema,
  })
  .superRefine((entry, ctx) => {
    const hasAnyValue =
      Boolean(entry.exerciseName) ||
      entry.weightLbs !== undefined ||
      entry.sets !== undefined ||
      entry.reps !== undefined;

    if (!hasAnyValue) {
      return;
    }

    if (!entry.exerciseName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["exerciseName"],
        message: "Exercise is required",
      });
    }

    if (entry.weightLbs === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["weightLbs"],
        message: "Weight is required",
      });
    }

    if (entry.sets === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["sets"],
        message: "Sets are required",
      });
    }

    if (entry.reps === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["reps"],
        message: "Reps are required",
      });
    }
  });

export const cardioEntrySchema = z
  .object({
    cardioType: z.string().trim().optional(),
    durationMin: optionalDurationSchema,
  })
  .superRefine((entry, ctx) => {
    const hasAnyValue =
      Boolean(entry.cardioType) || entry.durationMin !== undefined;

    if (!hasAnyValue) {
      return;
    }

    if (!entry.cardioType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cardioType"],
        message: "Cardio type is required",
      });
    }

    if (entry.durationMin === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["durationMin"],
        message: "Duration is required",
      });
    }
  });

const optionalBodyWeightSchema = z
  .number()
  .min(0, "Body weight must be positive")
  .optional();

export const quickEntryFormSchema = z
  .object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
    workoutType: workoutTypeEnum,
    bodyWeight: optionalBodyWeightSchema,
    exercises: z.array(exerciseEntrySchema),
    cardioEntries: z.array(cardioEntrySchema),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const hasExerciseEntry = data.exercises.some(
      (entry) =>
        Boolean(entry.exerciseName) &&
        entry.weightLbs !== undefined &&
        entry.reps !== undefined
    );
    const hasCardioEntry = data.cardioEntries.some(
      (entry) =>
        Boolean(entry.cardioType) && entry.durationMin !== undefined
    );

    if (
      (data.workoutType === "exercise_only" || data.workoutType === "both") &&
      !hasExerciseEntry
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["exercises"],
        message: "Add at least one complete exercise entry.",
      });
    }

    if (
      (data.workoutType === "cardio_only" || data.workoutType === "both") &&
      !hasCardioEntry
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cardioEntries"],
        message: "Add at least one complete cardio entry.",
      });
    }

    if (data.workoutType === "weight_only" && data.bodyWeight === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["bodyWeight"],
        message: "Body weight is required for weigh-in.",
      });
    }
  });

export type QuickEntryFormValues = z.infer<typeof quickEntryFormSchema>;
export type ExerciseEntry = z.infer<typeof exerciseEntrySchema>;
export type CardioEntry = z.infer<typeof cardioEntrySchema>;
