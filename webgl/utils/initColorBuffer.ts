export const initColorBuffer = (glContext: WebGLRenderingContext) => {
  const faceColors = [
    [1.0, 1.0, 1.0, 1.0], // Front face: white
    [1.0, 0.0, 0.0, 1.0], // Back face: red
    [0.0, 1.0, 0.0, 1.0], // Top face: green
    [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
    [1.0, 1.0, 0.0, 1.0], // Right face: yellow
    [1.0, 0.0, 1.0, 1.0], // Left face: purple
  ];

  const colors = faceColors.reduce(
    (result, colors) => [...result, ...colors, ...colors, ...colors, ...colors],
    [],
  );

  const colorBuffer = glContext.createBuffer();
  glContext.bindBuffer(glContext.ARRAY_BUFFER, colorBuffer);
  glContext.bufferData(
    glContext.ARRAY_BUFFER,
    new Float32Array(colors),
    glContext.STATIC_DRAW,
  );

  return colorBuffer;
};
