"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardEdit,
  CalendarDays,
  Dumbbell,
  History,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/log", label: "Log Workout", icon: ClipboardEdit },
  { href: "/plan", label: "Weekly Plan", icon: CalendarDays },
  { href: "/exercises", label: "Exercises", icon: Dumbbell },
  { href: "/history", label: "History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "sticky top-0 z-50 flex h-screen flex-col border-r border-black/5 bg-white/70 backdrop-blur-2xl transition-all duration-300",
        collapsed ? "w-20" : "w-20 sm:w-64"
      )}
    >
      {/* Decorative Gradient Line on the right edge */}
      <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-primary/30 to-transparent" />

      <div className="relative flex h-24 items-center gap-4 border-b border-black/5 px-4 sm:px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-50 mix-blend-multiply" />
        <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary shadow-[0_0_20px_rgba(255,100,0,0.15)] neon-border-orange transition-transform duration-500 hover:scale-110 hover:shadow-[0_0_30px_rgba(255,100,0,0.3)]">
          <Dumbbell className="h-6 w-6" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <span className="hidden text-2xl font-bold tracking-widest text-foreground font-[family-name:var(--font-barlow-condensed)] sm:block text-glow-orange">
            ALPHA<span className="text-primary">GYM</span>
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-2 px-3 py-8 sm:px-4">
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
                "group relative flex items-center gap-4 rounded-2xl px-3 py-3.5 text-sm font-semibold transition-all duration-300 cursor-pointer overflow-hidden",
                collapsed
                  ? "justify-center"
                  : "justify-center sm:justify-start",
                isActive
                  ? "bg-primary/10 text-primary shadow-[inset_0_0_0_1px_rgba(255,100,0,0.2)] shadow-[0_4px_20px_rgba(255,100,0,0.05)]"
                  : "text-foreground/70 hover:bg-black/5 hover:text-foreground"
              )}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50" />
              )}
              {isActive && (
                <div className="absolute left-0 top-1/2 h-1/2 w-[3px] -translate-y-1/2 rounded-r-full bg-primary shadow-[0_0_10px_rgba(255,100,0,0.4)]" />
              )}
              <item.icon
                className={cn(
                  "relative z-10 h-5 w-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110",
                  isActive ? "text-primary drop-shadow-[0_0_8px_rgba(255,100,0,0.4)]" : ""
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              {!collapsed && (
                <span className="relative z-10 hidden tracking-wide sm:inline">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle + footer */}
      <div className="relative border-t border-black/5 px-3 py-4 sm:px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
        {!collapsed && (
          <p className="hidden text-center text-xs font-bold uppercase tracking-[0.2em] text-primary/70 sm:block mb-3">
            Track. <span className="text-primary drop-shadow-[0_0_5px_rgba(255,100,0,0.3)]">Push.</span> Progress.
          </p>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="relative z-10 hidden w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-black/5 bg-white/60 px-3 py-2.5 text-xs font-semibold text-foreground/50 transition-all duration-200 hover:bg-black/5 hover:text-foreground sm:flex"
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
