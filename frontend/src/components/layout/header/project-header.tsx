import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/core/breadcrumb";
import { Separator } from "@/components/core/separator";
import HelpButton from "@/components/layout/header/help-button";
import { ProjectLayoutControls } from "@/components/layout/header/project-layout-controls";
import { PublishProject } from "@/components/project/publish/publish-project";

interface IProjectHeaderProps {
  projectId: string;
  title: string;
  className?: string;
}

export function ProjectHeader({
  projectId,
  title,
  className = "",
}: IProjectHeaderProps) {
  return (
    <header
      className={`flex bg-background border-b h-12 shrink-0 items-center gap-2 justify-between ${className}`}
    >
      <div className="flex min-w-0 items-center gap-2 px-3 sm:px-4">
        <Link
          className="flex items-center text-sm sm:text-base font-medium transition-opacity duration-200
                              group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:opacity-0
                              transform hover:scale-99"
          href={"/"}
        >
          React Map tools
        </Link>
        <Separator
          orientation="vertical"
          className="hidden sm:block mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb className="hidden sm:flex">
          <BreadcrumbList>
            <BreadcrumbItem className="capitalize">
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-1 pr-2 sm:gap-4 sm:pr-4">
        <ProjectLayoutControls />
        <HelpButton />
        <PublishProject projectId={projectId} />
      </div>
    </header>
  );
}
