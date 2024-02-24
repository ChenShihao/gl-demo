export const initIndexBuffer = (glContext: WebGLRenderingContext) => {
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
