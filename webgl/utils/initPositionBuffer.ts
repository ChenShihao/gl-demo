export const initPositionBuffer = (glContext: WebGLRenderingContext) => {
  const positionBuffer = glContext.createBuffer();

  glContext.bindBuffer(glContext.ARRAY_BUFFER, positionBuffer);

  const positions = [
    // Front face
    ...[
      //
      -1.0, -1.0, 1.0,
      //
      1.0, -1.0, 1.0,
      //
      1.0, 1.0, 1.0,
      //
      -1.0, 1.0, 1.0,
    ],
    // Back face
    ...[
      //
      -1.0, -1.0, -1.0,
      //
      -1.0, 1.0, -1.0,
      //
      1.0, 1.0, -1.0,
      //
      1.0, -1.0, -1.0,
    ],
    // Top face
    ...[
      //
      -1.0, 1.0, -1.0,
      //
      -1.0, 1.0, 1.0,
      //
      1.0, 1.0, 1.0,
      //
      1.0, 1.0, -1.0,
    ],
    // Bottom face
    ...[
      //
      -1.0, -1.0, -1.0,
      //
      1.0, -1.0, -1.0,
      //
      1.0, -1.0, 1.0,
      //
      -1.0, -1.0, 1.0,
    ],
    // Right face
    ...[
      //
      1.0, -1.0, -1.0,
      //
      1.0, 1.0, -1.0,
      //
      1.0, 1.0, 1.0,
      //
      1.0, -1.0, 1.0,
    ],
    // Left face
    ...[
      //
      -1.0, -1.0, -1.0,
      //
      -1.0, -1.0, 1.0,
      //
      -1.0, 1.0, 1.0,
      //
      -1.0, 1.0, -1.0,
    ],
  ];

  glContext.bufferData(
    glContext.ARRAY_BUFFER,
    new Float32Array(positions),
    glContext.STATIC_DRAW,
  );

  return positionBuffer;
};
