"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ExerciseComboboxProps {
  exerciseNames: { name: string; category: string }[];
  value: string;
  onChange: (value: string) => void;
}

const categoryLabels: Record<string, string> = {
  calisthenics: "Calisthenics",
  cardio: "Cardio",
  upper_body: "Upper Body",
  lower_body: "Lower Body",
};

export function ExerciseCombobox({
  exerciseNames,
  value,
  onChange,
}: ExerciseComboboxProps) {
  const [open, setOpen] = useState(false);

  const grouped: Record<string, { name: string; category: string }[]> = {};
  for (const ex of exerciseNames) {
    if (!grouped[ex.category]) grouped[ex.category] = [];
    grouped[ex.category].push(ex);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between cursor-pointer"
        >
          {value || "Select exercise..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search exercises..." />
          <CommandList>
            <CommandEmpty>No exercise found.</CommandEmpty>
            {Object.entries(grouped).map(([category, items]) => (
              <CommandGroup
                key={category}
                heading={categoryLabels[category] || category}
              >
                {items.map((ex) => (
                  <CommandItem
                    key={ex.name}
                    value={ex.name}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === ex.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {ex.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
