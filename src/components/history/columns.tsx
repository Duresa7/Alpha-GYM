"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  ExerciseLogEntry,
  CardioLogEntry,
  WeightLogEntry,
} from "@/types";

function SortableHeader({
  column,
  label,
}: {
  column: { toggleSorting: (desc: boolean) => void; getIsSorted: () => false | "asc" | "desc" };
  label: string;
}) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="cursor-pointer -ml-3"
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}

export function getExerciseColumns(
  onDelete: (id: number) => void | Promise<void>
): ColumnDef<ExerciseLogEntry>[] {
  return [
    {
      accessorKey: "date",
      header: ({ column }) => <SortableHeader column={column} label="Date" />,
      cell: ({ row }) => {
        const d = new Date(row.getValue<string>("date") + "T00:00:00");
        return d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      },
    },
    {
      accessorKey: "exerciseName",
      header: ({ column }) => (
        <SortableHeader column={column} label="Exercise" />
      ),
    },
    {
      accessorKey: "weightLbs",
      header: ({ column }) => (
        <SortableHeader column={column} label="Weight (lbs)" />
      ),
    },
    {
      accessorKey: "reps",
      header: ({ column }) => <SortableHeader column={column} label="Reps" />,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(row.original.id)}
          aria-label="Delete exercise log"
          title="Delete exercise log"
          className="cursor-pointer text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];
}

export function getCardioColumns(
  onDelete: (id: number) => void | Promise<void>
): ColumnDef<CardioLogEntry>[] {
  return [
    {
      accessorKey: "date",
      header: ({ column }) => <SortableHeader column={column} label="Date" />,
      cell: ({ row }) => {
        const d = new Date(row.getValue<string>("date") + "T00:00:00");
        return d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      },
    },
    {
      accessorKey: "cardioType",
      header: ({ column }) => <SortableHeader column={column} label="Type" />,
    },
    {
      accessorKey: "durationMin",
      header: ({ column }) => (
        <SortableHeader column={column} label="Duration (min)" />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(row.original.id)}
          aria-label="Delete cardio log"
          title="Delete cardio log"
          className="cursor-pointer text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];
}

export function getWeightColumns(
  onDelete: (id: number) => void | Promise<void>
): ColumnDef<WeightLogEntry>[] {
  return [
    {
      accessorKey: "date",
      header: ({ column }) => <SortableHeader column={column} label="Date" />,
      cell: ({ row }) => {
        const d = new Date(row.getValue<string>("date") + "T00:00:00");
        return d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      },
    },
    {
      accessorKey: "weightLbs",
      header: ({ column }) => (
        <SortableHeader column={column} label="Weight (lbs)" />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(row.original.id)}
          aria-label="Delete weight log"
          title="Delete weight log"
          className="cursor-pointer text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];
}
