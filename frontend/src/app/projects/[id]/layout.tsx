import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { ProjectHeader } from "@/components/layout/header/project-header";
import { ResizeLayout } from "@/components/layout/resize-layout";
import { ProjectLayoutProvider } from "@/components/project/project-layout-provider";
import { ProjectProvider } from "@/hooks/project/project-context";
import { PROJECT_DATA } from "@/config/project/project-data";

interface IProjectLayoutProps {
  params: Promise<{ id: string }>;
  children: ReactNode;
}

export async function generateMetadata({
  params,
}: Pick<IProjectLayoutProps, "params">) {
  const { id } = await params;
  return {
    title: `React map tools 🦝 ${PROJECT_DATA[id]?.title ?? "Project"}`,
    description: "Base setup for your map project.",
  };
}

export default async function ProjectLayout({
  params,
  children,
}: IProjectLayoutProps) {
  const { id } = await params;
  const projectData = PROJECT_DATA[id];
  if (!projectData) notFound();

  return (
    <NuqsAdapter>
      <ProjectLayoutProvider key={id}>
        <main className="pattern-bg">
          <div className="flex h-dvh max-h-dvh flex-col overflow-hidden">
            <ProjectHeader projectId={id} title={projectData.title} />
            <ProjectProvider projectId={id} projectData={projectData}>
              <ResizeLayout>{children}</ResizeLayout>
            </ProjectProvider>
          </div>
        </main>
      </ProjectLayoutProvider>
    </NuqsAdapter>
  );
}
