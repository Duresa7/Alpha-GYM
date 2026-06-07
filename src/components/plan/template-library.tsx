"use client";

import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WorkoutTemplate } from "@/types";

interface TemplateLibraryProps {
  isPending: boolean;
  templates: WorkoutTemplate[];
  onDuplicateTemplate: (templateId: number) => Promise<void>;
}

export function TemplateLibrary({
  isPending,
  templates,
  onDuplicateTemplate,
}: TemplateLibraryProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {templates.map((template) => (
        <Card key={template.id} className="app-surface">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="flex items-center justify-between gap-3 font-[family-name:var(--font-barlow-condensed)] text-xl">
              <span>{template.name}</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onDuplicateTemplate(template.id)}
                disabled={isPending}
                className="cursor-pointer"
              >
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {template.goalFocus ? (
                <Badge variant="outline">{template.goalFocus}</Badge>
              ) : null}
              {template.estimatedDurationMin ? (
                <Badge variant="outline">{template.estimatedDurationMin} min</Badge>
              ) : null}
            </div>
            {template.description ? (
              <p className="text-sm text-muted-foreground">
                {template.description}
              </p>
            ) : null}
            <div className="space-y-2">
              {template.items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-md border border-border bg-secondary px-3 py-2 text-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span>{item.exerciseName}</span>
                    <Badge variant="outline">{item.target || item.section}</Badge>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {item.groupLabel ? <span>{item.groupLabel}</span> : null}
                    <span>{item.itemType}</span>
                    <span>{item.section}</span>
                    <span>{item.isRequired ? "required" : "optional"}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
