"use client";

import ProjectMapLayout from "@/components/project/project-map-layout";

import { useProject } from "@/hooks/project/project-context";

export default function ProjectPage() {
  const { projectId, projectData } = useProject();

  return (
        <ProjectMapLayout
          projectId={projectId}
          projectData={projectData}
        />
  );
}