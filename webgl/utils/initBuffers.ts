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
}

export const initBuffers = (glContext: WebGLRenderingContext): BufferItem => {
  const positionBuffer = initPositionBuffer(glContext);

  return {
    position: positionBuffer,
  };
};
