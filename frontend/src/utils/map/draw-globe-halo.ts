/** Draw only the outside halo; the map pixels never enter this 2D canvas. */
export function drawGlobeHalo(
  context: CanvasRenderingContext2D,
  outline: string,
  color: string,
  width: number,
  height: number,
) {
  context.clearRect(0, 0, width, height);
  if (!outline) return;

  const path = new Path2D(outline);
  context.save();
  context.fillStyle = color;
  context.shadowColor = color;

  // Canvas shadowBlur uses half this value as its Gaussian standard deviation:
  // these recreate the tight 8px and soft 28px lobes of the CSS atmosphere.
  context.globalAlpha = 0.55;
  context.shadowBlur = 16;
  context.fill(path);
  context.globalAlpha = 0.3;
  context.shadowBlur = 56;
  context.fill(path);

  // Erase the silhouette itself so missing/transparent tiles cannot show its fill.
  context.globalAlpha = 1;
  context.shadowBlur = 0;
  context.globalCompositeOperation = "destination-out";
  context.fill(path);
  context.restore();
}
