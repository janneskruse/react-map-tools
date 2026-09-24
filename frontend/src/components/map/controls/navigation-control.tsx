
"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Plus, Minus, Navigation2 } from "lucide-react";
import { Button } from "@/components/core/button";
import { MapControlBox } from "../layout/map-controlbox";
import { Separator } from "@/components/core/separator";

import useMapStore from "@/store/map-state";

interface NavigationControlProps {
  mapId?: string; // optional map ID to target a specific map instance - defaults to "project-map"
  className?: string;
}

export const NavigationControl = ({
  mapId = "project-map", // default map ID
  className,
}: NavigationControlProps) => {
  const map = useMapStore((state) => state.getMap(mapId));
  const isLoaded = useMapStore((state) => state.getIsLoaded(mapId));
  const [bearing, setBearing] = useState(0);

  // Update compass rotation on map move
  useEffect(() => {
    if (!isLoaded || !map) return;

    const updateBearing = () => setBearing(map.getBearing());

    // console.log("adding listeners to map");
    map.on("rotate", updateBearing);
    map.on("move", updateBearing);

    // Set initial bearing
    // Synchronize the external map bearing when a map instance becomes available.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBearing(map.getBearing());

    return () => {
      map.off("rotate", updateBearing);
      map.off("move", updateBearing);
    };
  }, [isLoaded, map]);

  const handleZoomIn = useCallback(() => {
    if (isLoaded && map) {
      map.zoomIn();
    }
  }, [isLoaded, map]);

  const handleZoomOut = useCallback(() => {
    if (isLoaded && map) {
      map.zoomOut();
    }
  }, [isLoaded, map]);

  const handleResetNorth = useCallback(() => {
    if (isLoaded && map) {
      map.rotateTo(0, { duration: 300 });
    }
  }, [isLoaded, map]);

  return (
    <MapControlBox className={className || ""}>
      <Button
        className={`h-7 w-full rounded-none ${className || ""}`}
        variant="ghost"
        size="icon"
        aria-label="Zoom in"
        onClick={handleZoomIn}
      >
        <Plus size={18} />
      </Button>
      <Separator orientation="horizontal" className="w-full" />
      <Button
        className={`h-7 w-full rounded-none ${className || ""}`}
        variant="ghost"
        size="icon"
        aria-label="Zoom out"
        onClick={handleZoomOut}
      >
        <Minus size={18} />
      </Button>
      <Separator orientation="horizontal" className="w-full" />
      <Button
        className={`h-7 w-full rounded-none ${className || ""}`}
        variant="ghost"
        size="icon"
        aria-label="Reset north"
        onClick={handleResetNorth}
      >
        {/* <Compass size={18} style={{ transform: `rotate(${-bearing-45}deg)` }} /> */}
        <Navigation2
          size={18}
          style={{
            transform: `rotate(${-bearing}deg)`,
            transition: "transform 0.3s ease",
          }}
        />
      </Button>
    </MapControlBox>
  );
};

export default NavigationControl;
