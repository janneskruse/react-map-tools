
"use client";

import useLayerStore from "@/store/layer";

interface IProjectLegendProps {
  className?: string;
}

export function ProjectLegend({ className }: IProjectLegendProps) {
  const layers = useLayerStore((state) => state.layers);
  return (
    <ul className={className}>
      {layers
        .filter((entry) => entry.layer.props.visible)
        .map((entry) => (
          <li key={entry.id}>{entry.name}</li>
        ))}
    </ul>
  );
}
