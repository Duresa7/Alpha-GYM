"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardEdit,
  CalendarDays,
  Dumbbell,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/log", label: "Log Workout", icon: ClipboardEdit },
  { href: "/plan", label: "Weekly Plan", icon: CalendarDays },
  { href: "/exercises", label: "Exercises", icon: Dumbbell },
  { href: "/history", label: "History", icon: History },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-20 flex-col border-r border-sidebar-border/80 bg-sidebar/90 backdrop-blur-sm sm:w-64">
      <div className="relative flex h-20 items-center gap-3 border-b border-sidebar-border/80 px-4 sm:px-6">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/12 via-primary/6 to-transparent" />
        <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-primary/40 bg-primary/15 text-primary">
          <Dumbbell className="h-6 w-6" />
        </div>
        <span className="hidden text-xl font-bold tracking-wider text-primary font-[family-name:var(--font-barlow-condensed)] sm:block">
          ALPHA GYM
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4 sm:px-3">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 cursor-pointer sm:justify-start",
                isActive
                  ? "bg-primary/20 text-primary shadow-[inset_0_0_0_1px_rgba(249,115,22,0.35)]"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border/80 px-3 py-4 sm:px-6">
        <p className="hidden text-xs text-muted-foreground sm:block">
          Track. Push. Progress.
        </p>
      </div>
    </aside>
  );
}
