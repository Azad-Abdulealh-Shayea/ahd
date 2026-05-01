"use client";

import { useTheme } from "next-themes";
import { Moon01Icon, Sun01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === "dark";

  return (
    <button
      className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex size-6 items-center justify-center rounded-md"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "التبديل للوضع الفاتح" : "التبديل للوضع الداكن"}
    >
      {mounted ? (
        <HugeiconsIcon
          icon={isDark ? Moon01Icon : Sun01Icon}
          className="size-4"
        />
      ) : (
        <HugeiconsIcon icon={Sun01Icon} className="size-4" />
      )}
    </button>
  );
}
