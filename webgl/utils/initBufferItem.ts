const initPositionBuffer = (glContext: WebGLRenderingContext) => {
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

export interface BufferItem {
  position: WebGLBuffer | null;
  color: WebGLBuffer | null;
  indices: WebGLBuffer | null;
}

export const initColorBuffer = (glContext: WebGLRenderingContext) => {
  const faceColors = [
    [1.0, 1.0, 1.0, 1.0], // Front face: white
    [1.0, 0.0, 0.0, 1.0], // Back face: red
    [0.0, 1.0, 0.0, 1.0], // Top face: green
    [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
    [1.0, 1.0, 0.0, 1.0], // Right face: yellow
    [1.0, 0.0, 1.0, 1.0], // Left face: purple
  ];

  const colors = faceColors.reduce((result, colors) => {
    return [...result, ...colors, ...colors, ...colors, ...colors];
  }, []);

  const colorBuffer = glContext.createBuffer();
  glContext.bindBuffer(glContext.ARRAY_BUFFER, colorBuffer);
  glContext.bufferData(
    glContext.ARRAY_BUFFER,
    new Float32Array(colors),
    glContext.STATIC_DRAW,
  );

  return colorBuffer;
};

const initIndexBuffer = (glContext: WebGLRenderingContext) => {
  const indexBuffer = glContext.createBuffer();
  glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // 1 Face === 2 Triangles
  // Tips: better to generate it automatically.
  const indices = [
    [0, 1, 2],
    [0, 2, 3], // front
    [4, 5, 6],
    [4, 6, 7], // back
    [8, 9, 10],
    [8, 10, 11], // top
    [12, 13, 14],
    [12, 14, 15], // bottom
    [16, 17, 18],
    [16, 18, 19], // right
    [20, 21, 22],
    [20, 22, 23], // left
  ].reduce((result, current) => [...result, ...current], []);

  glContext.bufferData(
    glContext.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    glContext.STATIC_DRAW,
  );

  return indexBuffer;
};

export const initBufferItem = (
  glContext: WebGLRenderingContext,
): BufferItem => {
  const colorBuffer = initColorBuffer(glContext);
  const positionBuffer = initPositionBuffer(glContext);
  const indexBuffer = initIndexBuffer(glContext);

  return {
    position: positionBuffer,
    color: colorBuffer,
    indices: indexBuffer,
  };
};
