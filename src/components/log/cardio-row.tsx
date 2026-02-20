"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UseFormReturn } from "react-hook-form";
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
    <div className="flex items-start gap-2">
      <div className="flex-1 space-y-1">
        {index === 0 && (
          <label className="mb-1.5 block text-sm text-muted-foreground">
            Cardio Type
          </label>
        )}
        <Select
          value={form.watch(`cardioEntries.${index}.cardioType`) ?? ""}
          onValueChange={(val) =>
            form.setValue(`cardioEntries.${index}.cardioType`, val, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger className="cursor-pointer">
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
      <div className="w-32 space-y-1">
        {index === 0 && (
          <label className="mb-1.5 block text-sm text-muted-foreground">
            Duration (min)
          </label>
        )}
        <Input
          type="number"
          placeholder="0"
          {...form.register(`cardioEntries.${index}.durationMin`, {
            setValueAs: (value) =>
              value === "" ? undefined : Number(value),
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
        className="mt-6 cursor-pointer shrink-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
