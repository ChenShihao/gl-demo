export const setCanvasSize = (
  canvas: HTMLCanvasElement,
  glContext: WebGLRenderingContext,
  displaySize = 640,
) => {
  const renderSize = displaySize * (devicePixelRatio || 1);

  canvas.width = renderSize;
  canvas.height = renderSize;
  canvas.style.width = `${displaySize}px`;
  canvas.style.height = `${displaySize}px`;

  glContext.viewport(0, 0, canvas.width, canvas.height);
};
