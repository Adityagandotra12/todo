"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative flex h-5 w-5 flex-col items-center justify-center gap-1">
      <span
        className={`block h-0.5 w-4 bg-current transition-all duration-200 ${
          open ? "translate-y-1.5 rotate-45" : ""
        }`}
      />
      <span
        className={`block h-0.5 w-4 bg-current transition-all duration-200 ${
          open ? "opacity-0 scale-0" : ""
        }`}
      />
      <span
        className={`block h-0.5 w-4 bg-current transition-all duration-200 ${
          open ? "-translate-y-1.5 -rotate-45" : ""
        }`}
      />
    </span>
  );
}

function PlusIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}
function ListIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

const navItems = [
  { href: "/tasks/new", label: "New task", icon: PlusIcon, primary: true },
  { href: "/tasks", label: "Tasks", icon: ListIcon, primary: false },
  { href: "/dashboard", label: "Dashboard", icon: ChartIcon, primary: false },
] as const;

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Prevent body scroll when drawer is open on mobile
  useEffect(() => {
    if (menuOpen && typeof window !== "undefined" && window.innerWidth < 640) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/95 safe-area-inset-top sm:z-50">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href="/tasks/new"
            className="min-h-[44px] min-w-[44px] flex items-center text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:min-h-0 sm:min-w-0 sm:text-base"
          >
            <span className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-amber-400 bg-clip-text text-transparent">
              Task Manager
            </span>
          </Link>
          {/* Desktop nav: icons + labels, refined spacing */}
          <div className="hidden items-center gap-1 sm:flex">
            {navItems.map(({ href, label, icon: Icon, primary }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  primary
                    ? "bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-pink-600 text-white shadow-md shadow-fuchsia-500/25 hover:brightness-110 dark:shadow-fuchsia-500/20"
                    : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                }`}
              >
                <Icon />
                <span>{label}</span>
              </Link>
            ))}
            <div className="ml-2 h-6 w-px bg-zinc-200 dark:bg-zinc-700" aria-hidden />
            <ThemeToggle />
          </div>
          {/* Mobile: theme + hamburger with 44px touch targets */}
          <div className="flex items-center gap-1 sm:hidden">
            <div className="flex min-h-[44px] min-w-[44px] items-center justify-center">
              <ThemeToggle />
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-zinc-600 transition active:bg-zinc-200 dark:text-zinc-400 dark:active:bg-zinc-700"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer overlay + panel */}
      <div
        role="presentation"
        className={`fixed inset-0 z-50 sm:hidden ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
          aria-hidden
        />
        <div
          className={`absolute right-0 top-0 flex h-full w-[min(100%,280px)] flex-col border-l border-zinc-200 bg-white shadow-2xl transition-transform duration-300 ease-out dark:border-zinc-800 dark:bg-zinc-900 pr-[env(safe-area-inset-right)] ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex min-h-[56px] items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800">
            <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Menu</span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-zinc-600 transition active:bg-zinc-100 dark:text-zinc-400 dark:active:bg-zinc-800"
              aria-label="Close menu"
            >
              <MenuIcon open />
            </button>
          </div>
          <div className="flex flex-1 flex-col py-2">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="flex min-h-[48px] items-center gap-3 px-4 py-3 text-base font-medium text-zinc-800 transition active:bg-zinc-100 dark:text-zinc-200 dark:active:bg-zinc-800"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  <Icon />
                </span>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
