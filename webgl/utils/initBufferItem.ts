const initPositionBuffer = (glContext: WebGLRenderingContext) => {
  const positionBuffer = glContext.createBuffer();

  glContext.bindBuffer(glContext.ARRAY_BUFFER, positionBuffer);

  const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];

  glContext.bufferData(
    glContext.ARRAY_BUFFER,
    new Float32Array(positions),
    glContext.STATIC_DRAW,
  );

  return positionBuffer;
};

export interface BufferItem {
  position: WebGLBuffer | null;
  color: WebGLBuffer | null;
}

export const initColorBuffer = (glContext: WebGLRenderingContext) => {
  const colors = [
    1.0,
    1.0,
    1.0,
    1.0, // white
    1.0,
    0.0,
    0.0,
    1.0, // red
    0.0,
    1.0,
    0.0,
    1.0, // green
    0.0,
    0.0,
    1.0,
    1.0, // blue
  ];

  const colorBuffer = glContext.createBuffer();
  glContext.bindBuffer(glContext.ARRAY_BUFFER, colorBuffer);
  glContext.bufferData(
    glContext.ARRAY_BUFFER,
    new Float32Array(colors),
    glContext.STATIC_DRAW,
  );

  return colorBuffer;
};

export const initBufferItem = (
  glContext: WebGLRenderingContext,
): BufferItem => {
  const colorBuffer = initColorBuffer(glContext);
  const positionBuffer = initPositionBuffer(glContext);

  return {
    position: positionBuffer,
    color: colorBuffer,
  };
};
