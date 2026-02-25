"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
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

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getExerciseColumns(
  onEdit: (entry: ExerciseLogEntry) => void,
  onDelete: (id: number) => void | Promise<void>
): ColumnDef<ExerciseLogEntry>[] {
  return [
    {
      accessorKey: "date",
      header: ({ column }) => <SortableHeader column={column} label="Date" />,
      cell: ({ row }) => formatDate(row.getValue<string>("date")),
    },
    {
      accessorKey: "exerciseName",
      header: ({ column }) => (
        <SortableHeader column={column} label="Exercise" />
      ),
    },
    {
      accessorKey: "sets",
      header: ({ column }) => <SortableHeader column={column} label="Sets" />,
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
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(row.original)}
            aria-label="Edit exercise log"
            title="Edit exercise log"
            className="cursor-pointer text-muted-foreground hover:text-foreground"
          >
            <Pencil className="h-4 w-4" />
          </Button>
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
        </div>
      ),
    },
  ];
}

export function getCardioColumns(
  onEdit: (entry: CardioLogEntry) => void,
  onDelete: (id: number) => void | Promise<void>
): ColumnDef<CardioLogEntry>[] {
  return [
    {
      accessorKey: "date",
      header: ({ column }) => <SortableHeader column={column} label="Date" />,
      cell: ({ row }) => formatDate(row.getValue<string>("date")),
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
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(row.original)}
            aria-label="Edit cardio log"
            title="Edit cardio log"
            className="cursor-pointer text-muted-foreground hover:text-foreground"
          >
            <Pencil className="h-4 w-4" />
          </Button>
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
        </div>
      ),
    },
  ];
}

export function getWeightColumns(
  onEdit: (entry: WeightLogEntry) => void,
  onDelete: (id: number) => void | Promise<void>
): ColumnDef<WeightLogEntry>[] {
  return [
    {
      accessorKey: "date",
      header: ({ column }) => <SortableHeader column={column} label="Date" />,
      cell: ({ row }) => formatDate(row.getValue<string>("date")),
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
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(row.original)}
            aria-label="Edit weight log"
            title="Edit weight log"
            className="cursor-pointer text-muted-foreground hover:text-foreground"
          >
            <Pencil className="h-4 w-4" />
          </Button>
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
        </div>
      ),
    },
  ];
}
