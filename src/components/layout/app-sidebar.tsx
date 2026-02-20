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
    <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <Dumbbell className="h-7 w-7 text-primary" />
        <span className="text-xl font-bold tracking-wider text-primary font-[family-name:var(--font-barlow-condensed)]">
          ALPHA GYM
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
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
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer",
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border px-6 py-4">
        <p className="text-xs text-muted-foreground">
          Track. Push. Progress.
        </p>
      </div>
    </aside>
  );
}
