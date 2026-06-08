"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Bar, BarChart, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Droplets, GlassWater, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { addWaterIntake, deleteWaterEntry } from "@/actions/water-actions";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { WaterIntakeEntry, WaterIntakeStatus } from "@/types";

const QUICK_ADD_AMOUNTS = [8, 12, 16, 32] as const;

interface WaterTrackerProps {
  status: WaterIntakeStatus;
  todayEntries: WaterIntakeEntry[];
}

export function WaterTracker({ status, todayEntries }: WaterTrackerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleQuickAdd = useCallback(
    (amount: number) => {
      startTransition(async () => {
        try {
          await addWaterIntake(amount);
          toast.success(`Added ${amount} oz of water`);
          router.refresh();
        } catch {
          toast.error("Failed to log water");
        }
      });
    },
    [router]
  );

  const handleCustomAdd = useCallback(() => {
    const amount = Number(customAmount);
    if (!amount || amount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    startTransition(async () => {
      try {
        await addWaterIntake(amount);
        toast.success(`Added ${amount} oz of water`);
        setCustomAmount("");
        setShowCustomDialog(false);
        router.refresh();
      } catch {
        toast.error("Failed to log water");
      }
    });
  }, [customAmount, router]);

  const handleDelete = useCallback(
    async (id: number) => {
      setDeletingId(id);
      try {
        await deleteWaterEntry(id);
        toast.success("Entry removed");
        router.refresh();
      } catch {
        toast.error("Failed to delete");
      } finally {
        setDeletingId(null);
      }
    },
    [router]
  );

  const chartData = status.weeklyData.map((entry) => ({
    ...entry,
    day: new Date(entry.date + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "short",
    }),
    isGoalMet: status.goalOz ? entry.totalOz >= status.goalOz : false,
  }));

  return (
    <>
      <DashboardPanel
        title="Water Tracker"
        accentClassName="bg-cyan-300"
        headerContent={
          status.goalOz ? (
            <span className="text-xs font-semibold text-muted-foreground">
              Goal: {status.goalOz} oz
            </span>
          ) : null
        }
      >
        <div className="grid gap-5 lg:grid-cols-[160px_1fr]">
          <div className="flat-tile flex flex-col items-center justify-center text-center">
            <Droplets className="mb-2 h-6 w-6 text-cyan-300" />
            <p className="text-4xl font-bold text-foreground font-[family-name:var(--font-barlow-condensed)]">
              {status.todayTotal}
            </p>
            <p className="metric-label">oz today</p>
            {status.goalOz ? (
              <p className="mt-2 text-sm text-muted-foreground">
                {status.progressPercent}% of target
              </p>
            ) : null}
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {QUICK_ADD_AMOUNTS.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  onClick={() => handleQuickAdd(amount)}
                  disabled={isPending}
                  className="min-h-11 cursor-pointer"
                >
                  {amount} oz
                </Button>
              ))}
              <Button
                variant="outline"
                onClick={() => setShowCustomDialog(true)}
                disabled={isPending}
                className="min-h-11 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Custom
              </Button>
            </div>

            {todayEntries.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {todayEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center gap-2 rounded-md border border-border bg-secondary px-3 py-2 text-xs"
                  >
                    <GlassWater className="h-3.5 w-3.5 text-cyan-300" />
                    <span>{entry.amountOz} oz</span>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      disabled={deletingId === entry.id}
                      className="cursor-pointer text-muted-foreground transition-colors hover:text-destructive"
                      aria-label="Delete entry"
                    >
                      {deletingId === entry.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <p className="metric-label mb-3">Last 7 Days</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData}>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "oklch(0.72 0.02 95)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "oklch(0.72 0.02 95)" }}
                axisLine={false}
                tickLine={false}
                width={35}
              />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.16 0.012 250)",
                  border: "1px solid oklch(0.32 0.018 250)",
                  borderRadius: "8px",
                  color: "oklch(0.96 0.01 95)",
                  fontSize: "12px",
                }}
                formatter={(value) => [`${value} oz`, "Water"]}
              />
              {status.goalOz && (
                <ReferenceLine
                  y={status.goalOz}
                  stroke="oklch(0.72 0.13 190 / 0.55)"
                  strokeDasharray="6 3"
                  label={{
                    value: "Goal",
                    position: "right",
                    fontSize: 10,
                    fill: "oklch(0.72 0.13 190)",
                  }}
                />
              )}
              <Bar dataKey="totalOz" radius={[4, 4, 0, 0]} maxBarSize={36}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      entry.isGoalMet
                        ? "oklch(0.72 0.13 190)"
                        : "oklch(0.72 0.13 190 / 0.4)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </DashboardPanel>

      <Dialog
        open={showCustomDialog}
        onOpenChange={(open) => {
          if (!open && !isPending) {
            setShowCustomDialog(false);
          }
        }}
      >
        <DialogContent showCloseButton={!isPending}>
          <DialogHeader>
            <DialogTitle>Log Water</DialogTitle>
            <DialogDescription>
              Enter a custom amount of water in ounces.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="mb-1.5 block text-sm font-medium">
              Amount (oz)
            </label>
            <Input
              type="number"
              step="0.1"
              placeholder="20"
              value={customAmount}
              onChange={(event) => setCustomAmount(event.target.value)}
              disabled={isPending}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCustomDialog(false)}
              disabled={isPending}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCustomAdd}
              disabled={isPending}
              className="cursor-pointer"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Adding..." : "Add Water"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
