"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ClipboardEdit,
  Dumbbell,
  History,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", shortLabel: "Home", icon: LayoutDashboard },
  { href: "/log", label: "Log Workout", shortLabel: "Log", icon: ClipboardEdit },
  { href: "/plan", label: "Weekly Plan", shortLabel: "Plan", icon: CalendarDays },
  { href: "/exercises", label: "Exercises", shortLabel: "Moves", icon: Dumbbell },
  { href: "/history", label: "History", shortLabel: "History", icon: History },
  { href: "/settings", label: "Settings", shortLabel: "Settings", icon: Settings },
];

function isRouteActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "sticky top-0 z-40 hidden h-screen flex-col border-r border-border bg-card md:flex",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-20 items-center gap-3 border-b border-border px-4">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-md border border-primary/50 bg-primary text-primary-foreground">
          <Dumbbell className="h-5 w-5" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <span className="text-2xl font-bold text-foreground font-[family-name:var(--font-barlow-condensed)]">
            ALPHA<span className="text-primary">GYM</span>
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {navItems.map((item) => {
          const isActive = isRouteActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex min-h-11 items-center gap-3 rounded-md border px-3 text-sm font-semibold transition-[background-color,border-color,color,transform] duration-150",
                collapsed ? "justify-center" : "justify-start",
                isActive
                  ? "border-primary/50 bg-primary text-primary-foreground"
                  : "border-transparent text-muted-foreground hover:border-border hover:bg-secondary hover:text-foreground"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" strokeWidth={2.25} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex min-h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-border bg-secondary px-3 text-xs font-semibold text-muted-foreground transition-[background-color,color,border-color] hover:border-primary/40 hover:text-foreground"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-6 border-t border-border bg-card md:hidden">
      {navItems.map((item) => {
        const isActive = isRouteActive(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex h-16 min-w-0 flex-col items-center justify-center gap-1 text-[10px] font-semibold transition-[background-color,color] sm:text-xs",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
            aria-label={item.label}
          >
            <item.icon className="h-5 w-5" strokeWidth={2.35} />
            <span className="max-w-full truncate px-1">{item.shortLabel}</span>
          </Link>
        );
      })}
    </nav>
  );
}
