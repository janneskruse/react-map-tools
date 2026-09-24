"use client";
import { create } from 'zustand';

interface Theme {
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
}

export const useThemeStore = create<Theme>((set: (arg0: { selectedTheme: string; }) => void) => ({
  selectedTheme: 'dark',
  setSelectedTheme: (theme: string) => set({ selectedTheme: theme }),
}));