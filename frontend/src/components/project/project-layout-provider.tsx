"use client";

import { useState, type ReactNode } from "react";

import {
  ProjectLayoutContext,
  createProjectLayoutStore,
} from "@/store/project-layout";

interface IProjectLayoutProviderProps {
  children: ReactNode;
}

export function ProjectLayoutProvider({
  children,
}: IProjectLayoutProviderProps) {
  const [store] = useState(createProjectLayoutStore);
  return <ProjectLayoutContext value={store}>{children}</ProjectLayoutContext>;
}
