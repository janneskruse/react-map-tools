"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/theme";

export function useColorMode() {
  const selectedTheme = useThemeStore((state) => state.selectedTheme);
  useEffect(() => {
    let saved = "light";
    try {
      saved = localStorage.getItem("theme") === "dark" ? "dark" : "light";
    } catch {
      /* Storage is optional. */
    }
    useThemeStore.getState().setSelectedTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
    return useThemeStore.subscribe((state) => {
      document.documentElement.setAttribute("data-theme", state.selectedTheme);
      try {
        localStorage.setItem("theme", state.selectedTheme);
      } catch {
        /* Keep the preference in memory. */
      }
    });
  }, []);
  function onToggle() {
    useThemeStore
      .getState()
      .setSelectedTheme(selectedTheme === "light" ? "dark" : "light");
  }
  return { selectedTheme, onToggle };
}
