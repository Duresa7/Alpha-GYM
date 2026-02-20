"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
  const [deleteDialogState, setDeleteDialogState] =
    useState<DeleteDialogState | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    if (!deleteDialogState) {
      return null;
    }
    return DELETE_MESSAGES[deleteDialogState.type];
  }, [deleteDialogState]);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteDialogState) {
      return;
    }

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

  return (
    <>
      <Tabs defaultValue="exercises">
        <TabsList>
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
            columns={getExerciseColumns(handleDeleteExercise)}
            data={exerciseLogs}
            filterColumn="exerciseName"
            filterPlaceholder="Filter exercises..."
          />
        </TabsContent>
        <TabsContent value="cardio" className="mt-4">
          <DataTable
            columns={getCardioColumns(handleDeleteCardio)}
            data={cardioLogs}
            filterColumn="cardioType"
            filterPlaceholder="Filter cardio..."
          />
        </TabsContent>
        <TabsContent value="weight" className="mt-4">
          <DataTable
            columns={getWeightColumns(handleDeleteWeight)}
            data={weightLogs}
          />
        </TabsContent>
      </Tabs>

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
    </>
  );
}
