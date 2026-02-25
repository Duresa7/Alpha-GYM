"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataTable } from "./data-table";
import {
  getExerciseColumns,
  getCardioColumns,
  getWeightColumns,
} from "./columns";
import {
  deleteExerciseLog,
  deleteCardioLog,
  deleteWeightLog,
  updateExerciseLog,
  updateCardioLog,
  updateWeightLog,
} from "@/actions/history-actions";
import type {
  ExerciseLogEntry,
  CardioLogEntry,
  WeightLogEntry,
} from "@/types";

type LogType = "exercise" | "cardio" | "weight";

interface DeleteDialogState {
  id: number;
  type: LogType;
}

type EditDialogState =
  | { type: "exercise"; entry: ExerciseLogEntry }
  | { type: "cardio"; entry: CardioLogEntry }
  | { type: "weight"; entry: WeightLogEntry };

const DELETE_MESSAGES: Record<
  LogType,
  { title: string; description: string; success: string; error: string }
> = {
  exercise: {
    title: "Delete exercise log?",
    description:
      "This will permanently remove the selected exercise entry from your history.",
    success: "Exercise log deleted",
    error: "Failed to delete exercise log. Please try again.",
  },
  cardio: {
    title: "Delete cardio log?",
    description:
      "This will permanently remove the selected cardio entry from your history.",
    success: "Cardio log deleted",
    error: "Failed to delete cardio log. Please try again.",
  },
  weight: {
    title: "Delete weight log?",
    description:
      "This will permanently remove the selected body weight entry from your history.",
    success: "Weight log deleted",
    error: "Failed to delete weight log. Please try again.",
  },
};

interface HistoryTabsProps {
  exerciseLogs: ExerciseLogEntry[];
  cardioLogs: CardioLogEntry[];
  weightLogs: WeightLogEntry[];
}

export function HistoryTabs({
  exerciseLogs,
  cardioLogs,
  weightLogs,
}: HistoryTabsProps) {
  const router = useRouter();

  // Delete state
  const [deleteDialogState, setDeleteDialogState] =
    useState<DeleteDialogState | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit state
  const [editDialogState, setEditDialogState] =
    useState<EditDialogState | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState<Record<string, string>>({});

  // Delete handlers
  const handleDeleteRequest = useCallback((type: LogType, id: number) => {
    setDeleteDialogState({ id, type });
  }, []);

  const handleDeleteExercise = useCallback(
    (id: number) => handleDeleteRequest("exercise", id),
    [handleDeleteRequest]
  );

  const handleDeleteCardio = useCallback(
    (id: number) => handleDeleteRequest("cardio", id),
    [handleDeleteRequest]
  );

  const handleDeleteWeight = useCallback(
    (id: number) => handleDeleteRequest("weight", id),
    [handleDeleteRequest]
  );

  const currentDeleteMessages = useMemo(() => {
    if (!deleteDialogState) return null;
    return DELETE_MESSAGES[deleteDialogState.type];
  }, [deleteDialogState]);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteDialogState) return;

    const { id, type } = deleteDialogState;
    setIsDeleting(true);

    try {
      if (type === "exercise") {
        await deleteExerciseLog(id);
      } else if (type === "cardio") {
        await deleteCardioLog(id);
      } else {
        await deleteWeightLog(id);
      }

      toast.success(DELETE_MESSAGES[type].success);
      setDeleteDialogState(null);
      router.refresh();
    } catch {
      toast.error(DELETE_MESSAGES[type].error);
    } finally {
      setIsDeleting(false);
    }
  }, [deleteDialogState, router]);

  // Edit handlers
  const handleEditExercise = useCallback((entry: ExerciseLogEntry) => {
    setEditDialogState({ type: "exercise", entry });
    setEditForm({
      date: entry.date,
      exerciseName: entry.exerciseName,
      sets: String(entry.sets),
      weightLbs: String(entry.weightLbs),
      reps: String(entry.reps),
    });
  }, []);

  const handleEditCardio = useCallback((entry: CardioLogEntry) => {
    setEditDialogState({ type: "cardio", entry });
    setEditForm({
      date: entry.date,
      cardioType: entry.cardioType,
      durationMin: String(entry.durationMin),
    });
  }, []);

  const handleEditWeight = useCallback((entry: WeightLogEntry) => {
    setEditDialogState({ type: "weight", entry });
    setEditForm({
      date: entry.date,
      weightLbs: String(entry.weightLbs),
    });
  }, []);

  const handleCloseEdit = useCallback(() => {
    if (!isSaving) {
      setEditDialogState(null);
      setEditForm({});
    }
  }, [isSaving]);

  const handleSaveEdit = useCallback(async () => {
    if (!editDialogState) return;

    setIsSaving(true);

    try {
      if (editDialogState.type === "exercise") {
        await updateExerciseLog(editDialogState.entry.id, {
          date: editForm.date,
          exerciseName: editForm.exerciseName,
          sets: Number(editForm.sets),
          weightLbs: Number(editForm.weightLbs),
          reps: Number(editForm.reps),
        });
      } else if (editDialogState.type === "cardio") {
        await updateCardioLog(editDialogState.entry.id, {
          date: editForm.date,
          cardioType: editForm.cardioType,
          durationMin: Number(editForm.durationMin),
        });
      } else {
        await updateWeightLog(editDialogState.entry.id, {
          date: editForm.date,
          weightLbs: Number(editForm.weightLbs),
        });
      }

      toast.success("Log entry updated");
      setEditDialogState(null);
      setEditForm({});
      router.refresh();
    } catch {
      toast.error("Failed to update log entry. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [editDialogState, editForm, router]);

  const updateField = useCallback((key: string, value: string) => {
    setEditForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <>
      <Tabs defaultValue="exercises">
        <TabsList className="bg-muted/40">
          <TabsTrigger value="exercises" className="cursor-pointer">
            Exercises ({exerciseLogs.length})
          </TabsTrigger>
          <TabsTrigger value="cardio" className="cursor-pointer">
            Cardio ({cardioLogs.length})
          </TabsTrigger>
          <TabsTrigger value="weight" className="cursor-pointer">
            Weight ({weightLogs.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="exercises" className="mt-4">
          <DataTable
            columns={getExerciseColumns(handleEditExercise, handleDeleteExercise)}
            data={exerciseLogs}
            filterColumn="exerciseName"
            filterPlaceholder="Filter exercises..."
          />
        </TabsContent>
        <TabsContent value="cardio" className="mt-4">
          <DataTable
            columns={getCardioColumns(handleEditCardio, handleDeleteCardio)}
            data={cardioLogs}
            filterColumn="cardioType"
            filterPlaceholder="Filter cardio..."
          />
        </TabsContent>
        <TabsContent value="weight" className="mt-4">
          <DataTable
            columns={getWeightColumns(handleEditWeight, handleDeleteWeight)}
            data={weightLogs}
          />
        </TabsContent>
      </Tabs>

      {/* Delete confirmation dialog */}
      <Dialog
        open={Boolean(deleteDialogState)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setDeleteDialogState(null);
          }
        }}
      >
        <DialogContent showCloseButton={!isDeleting}>
          <DialogHeader>
            <DialogTitle>
              {currentDeleteMessages?.title ?? "Delete log entry?"}
            </DialogTitle>
            <DialogDescription>
              {currentDeleteMessages?.description ??
                "This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogState(null)}
              disabled={isDeleting}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="cursor-pointer"
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={Boolean(editDialogState)} onOpenChange={(open) => { if (!open) handleCloseEdit(); }}>
        <DialogContent showCloseButton={!isSaving}>
          <DialogHeader>
            <DialogTitle>Edit Log Entry</DialogTitle>
            <DialogDescription>
              Update the values below and save your changes.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Date</label>
              <Input
                type="date"
                value={editForm.date ?? ""}
                onChange={(e) => updateField("date", e.target.value)}
                disabled={isSaving}
              />
            </div>

            {editDialogState?.type === "exercise" && (
              <>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Exercise</label>
                  <Input
                    value={editForm.exerciseName ?? ""}
                    onChange={(e) => updateField("exerciseName", e.target.value)}
                    disabled={isSaving}
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Sets</label>
                    <Input
                      type="number"
                      value={editForm.sets ?? ""}
                      onChange={(e) => updateField("sets", e.target.value)}
                      disabled={isSaving}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Weight (lbs)</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={editForm.weightLbs ?? ""}
                      onChange={(e) => updateField("weightLbs", e.target.value)}
                      disabled={isSaving}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Reps</label>
                    <Input
                      type="number"
                      value={editForm.reps ?? ""}
                      onChange={(e) => updateField("reps", e.target.value)}
                      disabled={isSaving}
                    />
                  </div>
                </div>
              </>
            )}

            {editDialogState?.type === "cardio" && (
              <>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Cardio Type</label>
                  <Input
                    value={editForm.cardioType ?? ""}
                    onChange={(e) => updateField("cardioType", e.target.value)}
                    disabled={isSaving}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Duration (min)</label>
                  <Input
                    type="number"
                    value={editForm.durationMin ?? ""}
                    onChange={(e) => updateField("durationMin", e.target.value)}
                    disabled={isSaving}
                  />
                </div>
              </>
            )}

            {editDialogState?.type === "weight" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium">Weight (lbs)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={editForm.weightLbs ?? ""}
                  onChange={(e) => updateField("weightLbs", e.target.value)}
                  disabled={isSaving}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseEdit}
              disabled={isSaving}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveEdit}
              disabled={isSaving}
              className="cursor-pointer"
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
