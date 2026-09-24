
"use client";

import { useState } from "react";
import { TextInput } from "@/components/input/input-text";
import InputTextArea from "@/components/input/input-text-area";
import { Button } from "@/components/core/button";
import { cn } from "@/utils/shadcn-utils";

interface IGeneralSettingsProps {
  projectName: string;
  projectDescription: string;
  onSave: (name: string, description: string) => void;
  className?: string;
}

export default function GeneralSettings(props: IGeneralSettingsProps) {
  return (
    <GeneralSettingsForm
      key={`${props.projectName}:${props.projectDescription}`}
      {...props}
    />
  );
}

function GeneralSettingsForm({
  projectName,
  projectDescription,
  onSave,
  className,
}: IGeneralSettingsProps) {
  const [name, setName] = useState(projectName);
  const [description, setDescription] = useState(projectDescription);
  return (
    <form
      className={cn("flex flex-col gap-4 p-4", className)}
      onSubmit={(event) => {
        event.preventDefault();
        onSave(name, description);
      }}
    >
      <h2 className="text-lg font-semibold">General settings</h2>
      <TextInput
        id="project-name"
        label="Project name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <InputTextArea
        id="project-description"
        label="Project description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      <Button type="submit">Save</Button>
    </form>
  );
}
