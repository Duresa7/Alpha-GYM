"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Target, Droplets, Save } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setWeightGoal } from "@/actions/goal-actions";
import { setWaterGoal } from "@/actions/water-actions";

interface SettingsFormProps {
  currentWeightGoal: number | null;
  currentWaterGoal: number | null;
}

export function SettingsForm({
  currentWeightGoal,
  currentWaterGoal,
}: SettingsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [weightGoalInput, setWeightGoalInput] = useState(
    currentWeightGoal ? String(currentWeightGoal) : ""
  );
  const [waterGoalInput, setWaterGoalInput] = useState(
    currentWaterGoal ? String(currentWaterGoal) : ""
  );

  const handleSaveWeightGoal = useCallback(() => {
    const weight = Number(weightGoalInput);
    if (!weight || weight <= 0) {
      toast.error("Enter a valid weight");
      return;
    }
    startTransition(async () => {
      try {
        await setWeightGoal(weight);
        toast.success("Weight goal updated!");
        router.refresh();
      } catch {
        toast.error("Failed to save weight goal");
      }
    });
  }, [weightGoalInput, router]);

  const handleSaveWaterGoal = useCallback(() => {
    const goal = Number(waterGoalInput);
    if (!goal || goal <= 0) {
      toast.error("Enter a valid goal");
      return;
    }
    startTransition(async () => {
      try {
        await setWaterGoal(goal);
        toast.success("Water goal updated!");
        router.refresh();
      } catch {
        toast.error("Failed to save water goal");
      }
    });
  }, [waterGoalInput, router]);

  return (
    <div className="space-y-6">
      {/* Weight Loss Goal */}
      <Card className="app-surface overflow-visible">
        <CardHeader className="border-b border-black/5 pb-4">
          <CardTitle className="flex items-center gap-3 font-[family-name:var(--font-barlow-condensed)] text-lg tracking-wide text-foreground">
            <Target className="h-5 w-5 text-primary" />
            Weight Loss Goal
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="mb-4 text-sm text-foreground/50">
            Set your target body weight. You&apos;ll earn XP for every 0.1 lb
            lost from your starting weight.
          </p>
          <div className="flex items-end gap-3">
            <div className="flex-1 max-w-xs">
              <label className="mb-1.5 block text-sm font-medium">
                Goal Weight (lbs)
              </label>
              <Input
                type="number"
                step="0.1"
                placeholder="e.g. 170"
                value={weightGoalInput}
                onChange={(e) => setWeightGoalInput(e.target.value)}
                disabled={isPending}
              />
            </div>
            <Button
              onClick={handleSaveWeightGoal}
              disabled={isPending}
              className="cursor-pointer"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Water Goal */}
      <Card className="app-surface overflow-visible">
        <CardHeader className="border-b border-black/5 pb-4">
          <CardTitle className="flex items-center gap-3 font-[family-name:var(--font-barlow-condensed)] text-lg tracking-wide text-foreground">
            <Droplets className="h-5 w-5 text-[#0ea5e9]" />
            Daily Water Goal
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="mb-4 text-sm text-foreground/50">
            How many ounces of water do you want to drink each day?
          </p>
          <div className="flex items-end gap-3">
            <div className="flex-1 max-w-xs">
              <label className="mb-1.5 block text-sm font-medium">
                Daily Goal (oz)
              </label>
              <Input
                type="number"
                step="1"
                placeholder="e.g. 128"
                value={waterGoalInput}
                onChange={(e) => setWaterGoalInput(e.target.value)}
                disabled={isPending}
              />
            </div>
            <Button
              onClick={handleSaveWaterGoal}
              disabled={isPending}
              className="cursor-pointer"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
