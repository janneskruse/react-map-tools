"use client";

import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/core/button";
import useLayerStore from "@/store/layer";

export function LayerPanel() {
  const layers = useLayerStore((state) => state.layers);
  const status = useLayerStore((state) => state.status);
  const error = useLayerStore((state) => state.error);
  const setVisibility = useLayerStore((state) => state.setVisibility);
  return (
    <section
      className="flex w-56 max-w-[55vw] flex-col gap-4 p-4"
      aria-label="Map layers"
    >
      <h2 className="font-semibold">Layers</h2>
      {status === "loading" && (
        <p role="status" className="text-sm text-muted-foreground">
          Loading hexagons…
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <ul className="flex flex-col gap-2">
        {layers.map(({ id, name, layer }) => (
          <li key={id} className="flex items-center justify-between gap-3">
            <span className="text-sm">{name}</span>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`${layer.props.visible ? "Hide" : "Show"} ${name}`}
              aria-pressed={layer.props.visible}
              onClick={() => setVisibility(id, !layer.props.visible)}
            >
              {layer.props.visible ? <Eye /> : <EyeOff />}
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
