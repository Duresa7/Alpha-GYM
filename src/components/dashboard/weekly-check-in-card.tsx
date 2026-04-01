"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { HeartPulse, Loader2, Ruler, Save, TimerReset } from "lucide-react";
import { toast } from "sonner";
import { submitWeeklyCheckIn } from "@/actions/log-actions";
import { Button } from "@/components/ui/button";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ENERGY_LEVELS } from "@/lib/constants";
import type { WeeklyCheckInInsight } from "@/types";

interface WeeklyCheckInCardProps {
  insight: WeeklyCheckInInsight;
}

export function WeeklyCheckInCard({ insight }: WeeklyCheckInCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    waistInches: "",
    energyLevel: "3",
    stepCount: "",
    frontPhotoUrl: "",
    sidePhotoUrl: "",
    notes: "",
  });

  function updateField(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit() {
    startTransition(async () => {
      try {
        await submitWeeklyCheckIn({
          date: form.date,
          waistInches: form.waistInches ? Number(form.waistInches) : undefined,
          energyLevel: form.energyLevel ? Number(form.energyLevel) : undefined,
          stepCount: form.stepCount ? Number(form.stepCount) : undefined,
          frontPhotoUrl: form.frontPhotoUrl,
          sidePhotoUrl: form.sidePhotoUrl,
          notes: form.notes,
        });
        toast.success("Weekly check-in saved.");
        router.refresh();
      } catch {
        toast.error("Failed to save weekly check-in.");
      }
    });
  }

  return (
    <DashboardPanel
      title="Weekly Check-In"
      accentClassName="bg-sky-500 text-sky-500"
    >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-black/5 bg-white/50 p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/50">
              Latest Check-In
            </p>
            {insight.latest ? (
              <div className="mt-3 space-y-2 text-sm">
                <p>{insight.latest.date}</p>
                <p className="flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-sky-600" />
                  {insight.latest.waistInches ? `${insight.latest.waistInches} in waist` : "Waist not logged"}
                </p>
                <p className="flex items-center gap-2">
                  <HeartPulse className="h-4 w-4 text-rose-500" />
                  Energy {insight.latest.energyLevel ?? "--"} / 5
                </p>
                <p className="flex items-center gap-2">
                  <TimerReset className="h-4 w-4 text-emerald-600" />
                  {insight.latest.stepCount ? `${insight.latest.stepCount} steps` : "Steps not logged"}
                </p>
                {insight.latest.notes ? (
                  <p className="text-muted-foreground">{insight.latest.notes}</p>
                ) : null}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                No weekly check-ins yet. Log one to track waist, energy, steps, and photo references.
              </p>
            )}
          </div>

          <div className="rounded-xl border border-black/5 bg-white/50 p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/50">
              Total Check-Ins
            </p>
            <p className="mt-3 text-4xl font-black font-[family-name:var(--font-barlow-condensed)]">
              {insight.count}
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Date</label>
            <Input type="date" value={form.date} onChange={(event) => updateField("date", event.target.value)} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Waist (in)</label>
            <Input
              type="number"
              step="0.1"
              value={form.waistInches}
              onChange={(event) => updateField("waistInches", event.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Energy Level</label>
            <select
              value={form.energyLevel}
              onChange={(event) => updateField("energyLevel", event.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-white/70 px-3 py-2 text-sm"
            >
              {ENERGY_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Steps</label>
            <Input
              type="number"
              value={form.stepCount}
              onChange={(event) => updateField("stepCount", event.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Front Photo URL</label>
            <Input
              value={form.frontPhotoUrl}
              onChange={(event) => updateField("frontPhotoUrl", event.target.value)}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Side Photo URL</label>
            <Input
              value={form.sidePhotoUrl}
              onChange={(event) => updateField("sidePhotoUrl", event.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-medium">Notes</label>
            <Textarea
              value={form.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              placeholder="Energy, recovery, belt notch, or anything worth noting."
            />
          </div>
        </div>

        <Button onClick={handleSubmit} disabled={isPending} className="cursor-pointer">
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Check-In
        </Button>
    </DashboardPanel>
  );
}
