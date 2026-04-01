"use client";

import { ArrowDown, ArrowUp, Loader2, Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MAX_TEMPLATE_ITEMS } from "@/lib/constants";
import {
  templateSectionOptions,
  type TemplateDraftItem,
} from "./plan-workspace-shared";

interface TemplateBuilderCardProps {
  draftItems: TemplateDraftItem[];
  isPending: boolean;
  templateDescription: string;
  templateDuration: string;
  templateGoalFocus: string;
  templateName: string;
  onAddDraftItem: () => void;
  onCreateTemplate: () => Promise<void>;
  onMoveDraftItem: (index: number, direction: -1 | 1) => void;
  onTemplateDescriptionChange: (value: string) => void;
  onTemplateDurationChange: (value: string) => void;
  onTemplateGoalFocusChange: (value: string) => void;
  onTemplateNameChange: (value: string) => void;
  onUpdateDraftItem: (index: number, patch: Partial<TemplateDraftItem>) => void;
}

export function TemplateBuilderCard({
  draftItems,
  isPending,
  templateDescription,
  templateDuration,
  templateGoalFocus,
  templateName,
  onAddDraftItem,
  onCreateTemplate,
  onMoveDraftItem,
  onTemplateDescriptionChange,
  onTemplateDurationChange,
  onTemplateGoalFocusChange,
  onTemplateNameChange,
  onUpdateDraftItem,
}: TemplateBuilderCardProps) {
  return (
    <Card className="app-surface">
      <CardHeader>
        <CardTitle className="font-[family-name:var(--font-barlow-condensed)] text-xl">
          Build a Template
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Name</label>
            <Input
              value={templateName}
              onChange={(event) => onTemplateNameChange(event.target.value)}
              disabled={isPending}
              placeholder="Upper A"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Focus</label>
            <Input
              value={templateGoalFocus}
              onChange={(event) => onTemplateGoalFocusChange(event.target.value)}
              disabled={isPending}
              placeholder="Strength + cardio"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Estimated Duration (min)
            </label>
            <Input
              type="number"
              value={templateDuration}
              onChange={(event) => onTemplateDurationChange(event.target.value)}
              disabled={isPending}
              placeholder="60"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-medium">
              Description
            </label>
            <Textarea
              value={templateDescription}
              onChange={(event) => onTemplateDescriptionChange(event.target.value)}
              disabled={isPending}
              placeholder="Short intent for this workout."
            />
          </div>
        </div>

        <div className="space-y-3">
          {draftItems.map((item, index) => (
            <div
              key={`${index}-${item.exerciseName}`}
              className="rounded-xl border border-black/5 bg-white/50 p-4"
            >
              <div className="grid gap-3 md:grid-cols-5">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Type
                  </label>
                  <select
                    value={item.itemType}
                    onChange={(event) =>
                      onUpdateDraftItem(index, {
                        itemType: event.target.value as TemplateDraftItem["itemType"],
                      })
                    }
                    disabled={isPending}
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  >
                    <option value="exercise">Exercise</option>
                    <option value="cardio">Cardio</option>
                    <option value="mobility">Mobility</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Name
                  </label>
                  <Input
                    value={item.exerciseName}
                    onChange={(event) =>
                      onUpdateDraftItem(index, {
                        exerciseName: event.target.value,
                      })
                    }
                    disabled={isPending}
                    placeholder="Goblet Squat"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Target
                  </label>
                  <Input
                    value={item.target}
                    onChange={(event) =>
                      onUpdateDraftItem(index, { target: event.target.value })
                    }
                    disabled={isPending}
                    placeholder="4x10"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Section
                  </label>
                  <select
                    value={item.section}
                    onChange={(event) =>
                      onUpdateDraftItem(index, { section: event.target.value })
                    }
                    disabled={isPending}
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  >
                    {templateSectionOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto_auto_auto]">
                <Input
                  value={item.instruction}
                  onChange={(event) =>
                    onUpdateDraftItem(index, { instruction: event.target.value })
                  }
                  disabled={isPending}
                  placeholder="Optional cue or note"
                />
                <Button
                  type="button"
                  variant={item.isRequired ? "default" : "outline"}
                  onClick={() =>
                    onUpdateDraftItem(index, { isRequired: !item.isRequired })
                  }
                  disabled={isPending}
                  className="cursor-pointer"
                >
                  {item.isRequired ? "Required" : "Optional"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onMoveDraftItem(index, -1)}
                  disabled={isPending || index === 0}
                  className="cursor-pointer"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onMoveDraftItem(index, 1)}
                  disabled={isPending || index === draftItems.length - 1}
                  className="cursor-pointer"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onAddDraftItem}
            disabled={isPending || draftItems.length >= MAX_TEMPLATE_ITEMS}
            className="cursor-pointer"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
          <Button
            type="button"
            onClick={onCreateTemplate}
            disabled={isPending}
            className="cursor-pointer"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
