"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  return (
    <label className="grid min-w-0 grid-cols-[minmax(0,1fr)_7rem] items-center gap-2 text-sm text-neutral-600 dark:text-neutral-200">
      <span>Appearance</span>
      <select
        aria-label="Color theme"
        className="h-10 w-full min-w-0 rounded-lg border border-neutral-300 bg-white px-3 text-neutral-900 dark:border-[#2b2e36] dark:bg-[#111318] dark:text-neutral-100"
        value={mounted ? theme : "system"}
        onChange={(event) => setTheme(event.target.value)}
      >
        <option value="system">Device</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  );
}
