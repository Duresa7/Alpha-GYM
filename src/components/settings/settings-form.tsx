"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Target, Footprints, CalendarRange } from "lucide-react";
import { toast } from "sonner";
import { saveGoalSettings } from "@/actions/goal-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { UserGoalSettings } from "@/types";

interface SettingsFormProps {
  settings: UserGoalSettings;
}

type SettingsFieldKey = keyof UserGoalSettings;

function toOptionalNumber(value: string) {
  return value.trim() ? Number(value) : undefined;
}

const weightAndHydrationFields: Array<{
  key: SettingsFieldKey;
  label: string;
  type?: "number";
  step?: string;
}> = [
  { key: "goalWeight", label: "Goal Weight (lbs)", type: "number", step: "0.1" },
  { key: "waterGoalOz", label: "Daily Water Goal (oz)", type: "number" },
];

const adherenceFields: Array<{
  key: SettingsFieldKey;
  label: string;
}> = [
  { key: "weeklyWorkoutTarget", label: "Workouts / week" },
  { key: "weeklyCardioMinutesTarget", label: "Cardio minutes / week" },
  { key: "weeklyWeighInTarget", label: "Weigh-ins / week" },
];

export function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    goalWeight: settings.goalWeight ? String(settings.goalWeight) : "",
    waterGoalOz: settings.waterGoalOz ? String(settings.waterGoalOz) : "",
    weeklyWorkoutTarget: settings.weeklyWorkoutTarget
      ? String(settings.weeklyWorkoutTarget)
      : "",
    weeklyCardioMinutesTarget: settings.weeklyCardioMinutesTarget
      ? String(settings.weeklyCardioMinutesTarget)
      : "",
    weeklyWeighInTarget: settings.weeklyWeighInTarget
      ? String(settings.weeklyWeighInTarget)
      : "",
    dailyStepTarget: settings.dailyStepTarget ? String(settings.dailyStepTarget) : "",
  });

  function updateField(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSave() {
    startTransition(async () => {
      try {
        await saveGoalSettings({
          goalWeight: toOptionalNumber(form.goalWeight),
          waterGoalOz: toOptionalNumber(form.waterGoalOz),
          weeklyWorkoutTarget: toOptionalNumber(form.weeklyWorkoutTarget),
          weeklyCardioMinutesTarget: toOptionalNumber(form.weeklyCardioMinutesTarget),
          weeklyWeighInTarget: toOptionalNumber(form.weeklyWeighInTarget),
          dailyStepTarget: toOptionalNumber(form.dailyStepTarget),
        });
        toast.success("Targets updated.");
        router.refresh();
      } catch {
        toast.error("Failed to save targets.");
      }
    });
  }

  return (
    <div className="space-y-6">
      <Card className="app-surface overflow-visible">
        <CardHeader className="border-b border-black/5 pb-4">
          <CardTitle className="flex items-center gap-3 font-[family-name:var(--font-barlow-condensed)] text-lg tracking-wide text-foreground">
            <Target className="h-5 w-5 text-primary" />
            Weight and Hydration Targets
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 pt-6 md:grid-cols-2">
          {weightAndHydrationFields.map((field) => (
            <div key={field.key}>
              <label className="mb-1.5 block text-sm font-medium">{field.label}</label>
              <Input
                type={field.type}
                step={field.step}
                value={form[field.key] ?? ""}
                onChange={(event) => updateField(field.key, event.target.value)}
                disabled={isPending}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="app-surface overflow-visible">
        <CardHeader className="border-b border-black/5 pb-4">
          <CardTitle className="flex items-center gap-3 font-[family-name:var(--font-barlow-condensed)] text-lg tracking-wide text-foreground">
            <CalendarRange className="h-5 w-5 text-[#0ea5e9]" />
            Weekly Adherence Targets
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 pt-6 md:grid-cols-3">
          {adherenceFields.map((field) => (
            <div key={field.key}>
              <label className="mb-1.5 block text-sm font-medium">{field.label}</label>
              <Input
                type="number"
                value={form[field.key] ?? ""}
                onChange={(event) => updateField(field.key, event.target.value)}
                disabled={isPending}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="app-surface overflow-visible">
        <CardHeader className="border-b border-black/5 pb-4">
          <CardTitle className="flex items-center gap-3 font-[family-name:var(--font-barlow-condensed)] text-lg tracking-wide text-foreground">
            <Footprints className="h-5 w-5 text-emerald-600" />
            Daily Movement
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 pt-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Daily step target</label>
            <Input
              type="number"
              value={form.dailyStepTarget}
              onChange={(event) => updateField("dailyStepTarget", event.target.value)}
              disabled={isPending}
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isPending} className="cursor-pointer">
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Targets
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
