"use client";

import { X } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { QuickEntryFormValues } from "@/lib/validators";

interface CardioRowProps {
  index: number;
  form: UseFormReturn<QuickEntryFormValues>;
  onRemove: () => void;
  canRemove: boolean;
}

const CARDIO_TYPES = [
  "Stationary Bike",
  "Treadmill",
  "Elliptical",
  "Rowing Machine",
  "Jump Rope",
  "Brisk Walk",
];

export function CardioRow({
  index,
  form,
  onRemove,
  canRemove,
}: CardioRowProps) {
  const rowErrors = form.formState.errors.cardioEntries?.[index];

  return (
    <div className="rounded-md border border-border bg-secondary p-3">
      <div className="grid gap-3 sm:grid-cols-[minmax(180px,1fr)_120px_44px] sm:items-start">
        <div className="space-y-1">
          <label className="block text-sm font-medium">Cardio Type</label>
          <Select
            value={form.watch(`cardioEntries.${index}.cardioType`) ?? ""}
            onValueChange={(val) =>
              form.setValue(`cardioEntries.${index}.cardioType`, val, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger className="min-h-11 w-full cursor-pointer">
              <SelectValue placeholder="Select type..." />
            </SelectTrigger>
            <SelectContent>
              {CARDIO_TYPES.map((type) => (
                <SelectItem key={type} value={type} className="cursor-pointer">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {rowErrors?.cardioType?.message ? (
            <p className="text-sm text-destructive">
              {rowErrors.cardioType.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Minutes</label>
          <Input
            type="number"
            placeholder="0"
            className="min-h-11"
            {...form.register(`cardioEntries.${index}.durationMin`, {
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
            })}
          />
          {rowErrors?.durationMin?.message ? (
            <p className="text-sm text-destructive">
              {rowErrors.durationMin.message}
            </p>
          ) : null}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          disabled={!canRemove}
          className="min-h-11 cursor-pointer self-end justify-self-start sm:justify-self-end"
          aria-label="Remove cardio"
          title="Remove cardio"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
