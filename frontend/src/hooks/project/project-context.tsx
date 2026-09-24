
'use client';
import { createContext, useContext, ReactNode } from 'react';
import type { TProjectData } from '@/types/project';

type ProjectContextType = {
  projectId: string;
  projectData: TProjectData | null;
};

export const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ 
  children, 
  projectId,
  projectData,
}: { 
  children: ReactNode; 
  projectId: string;
  projectData: TProjectData | null;
}) {
  return (
    <ProjectContext.Provider value={{ projectId, projectData }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}