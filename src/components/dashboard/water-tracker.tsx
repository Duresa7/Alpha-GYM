"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Droplets,
  Plus,
  Loader2,
  GlassWater,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  Cell,
} from "recharts";
import {
  addWaterIntake,
  deleteWaterEntry,
} from "@/actions/water-actions";
import type { WaterIntakeStatus, WaterIntakeEntry } from "@/types";

const QUICK_ADD_AMOUNTS = [
  { label: "8 oz", value: 8, icon: "💧" },
  { label: "12 oz", value: 12, icon: "🥤" },
  { label: "16 oz", value: 16, icon: "🫗" },
  { label: "32 oz", value: 32, icon: "🍶" },
];

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

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (status.progressPercent / 100) * circumference;

  const chartData = status.weeklyData.map((d) => ({
    ...d,
    day: new Date(d.date + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "short",
    }),
    isGoalMet: status.goalOz ? d.totalOz >= status.goalOz : false,
  }));

  return (
    <>
      <Card className="app-surface panel-hover group relative overflow-hidden rounded-2xl border border-black/10 bg-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] backdrop-blur-2xl">
        <span className="absolute inset-0 z-0 bg-gradient-to-br from-black/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <CardHeader className="relative z-10 border-b border-black/5 pb-4">
          <CardTitle className="flex items-center justify-between font-[family-name:var(--font-barlow-condensed)] text-xl tracking-wide text-foreground drop-shadow-sm">
            <span className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#0ea5e9] shadow-[0_0_8px_rgba(14,165,233,0.5)] animate-pulse" />
              Water Tracker
            </span>
            {status.goalOz && (
              <span className="text-xs font-medium text-foreground/40">
                Goal: {status.goalOz} oz
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 pt-6 space-y-6">
          {/* Today's Progress */}
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-around">
            {/* Progress Ring */}
            <div className="relative flex h-36 w-36 items-center justify-center">
              <svg
                className="absolute -rotate-90"
                width="136"
                height="136"
                viewBox="0 0 136 136"
              >
                <circle
                  cx="68"
                  cy="68"
                  r={radius}
                  fill="none"
                  stroke="rgba(0,0,0,0.05)"
                  strokeWidth="10"
                />
                <circle
                  cx="68"
                  cy="68"
                  r={radius}
                  fill="none"
                  stroke="url(#waterGradient)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-700 ease-out"
                />
                <defs>
                  <linearGradient
                    id="waterGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="z-10 text-center">
                <Droplets className="mx-auto mb-1 h-5 w-5 text-[#0ea5e9]" />
                <p className="text-2xl font-black font-[family-name:var(--font-barlow-condensed)] text-foreground">
                  {status.todayTotal}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">
                  oz today
                </p>
              </div>
            </div>

            {/* Quick Add Buttons */}
            <div className="space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/50 text-center sm:text-left">
                Quick Add
              </p>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_ADD_AMOUNTS.map((item) => (
                  <Button
                    key={item.value}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAdd(item.value)}
                    disabled={isPending}
                    className="cursor-pointer flex items-center gap-1.5 text-xs"
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCustomDialog(true)}
                disabled={isPending}
                className="cursor-pointer w-full text-xs"
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Custom Amount
              </Button>
            </div>

            {/* Today's Entries */}
            {todayEntries.length > 0 && (
              <div className="space-y-2 sm:max-w-[160px]">
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/50 text-center sm:text-left">
                  Today&apos;s Log
                </p>
                <div className="max-h-[140px] space-y-1.5 overflow-y-auto pr-1">
                  {todayEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-black/5 bg-white/60 px-2.5 py-1.5 text-xs"
                    >
                      <span className="flex items-center gap-1.5">
                        <GlassWater className="h-3 w-3 text-[#0ea5e9]" />
                        {entry.amountOz} oz
                      </span>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        disabled={deletingId === entry.id}
                        className="cursor-pointer text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Delete entry"
                      >
                        {deletingId === entry.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 7-day Trend */}
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/50">
              Last 7 Days
            </p>
            <div className="relative">
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={chartData}>
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11, fill: "rgba(0,0,0,0.4)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "rgba(0,0,0,0.3)" }}
                    axisLine={false}
                    tickLine={false}
                    width={35}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(255,255,255,0.9)",
                      border: "1px solid rgba(0,0,0,0.1)",
                      borderRadius: "12px",
                      fontSize: "12px",
                      backdropFilter: "blur(8px)",
                    }}
                    formatter={(value) => [`${value} oz`, "Water"]}
                  />
                  {status.goalOz && (
                    <ReferenceLine
                      y={status.goalOz}
                      stroke="rgba(14,165,233,0.3)"
                      strokeDasharray="6 3"
                      label={{
                        value: "Goal",
                        position: "right",
                        fontSize: 10,
                        fill: "rgba(14,165,233,0.6)",
                      }}
                    />
                  )}
                  <Bar dataKey="totalOz" radius={[6, 6, 0, 0]} maxBarSize={36}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={
                          entry.isGoalMet
                            ? "rgba(14,165,233,0.7)"
                            : "rgba(14,165,233,0.3)"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Amount Dialog */}
      <Dialog
        open={showCustomDialog}
        onOpenChange={(open) => {
          if (!open && !isPending) setShowCustomDialog(false);
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
              placeholder="e.g. 20"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
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
