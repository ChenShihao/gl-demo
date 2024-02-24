export const initProgramInfo = (
  glContext: WebGLRenderingContext,
  glProgram: WebGLProgram,
) => ({
  program: glProgram,
  attribLocations: {
    vertexPosition: glContext.getAttribLocation(glProgram, "aVertexPosition"),
    vertexColor: glContext.getAttribLocation(glProgram, "aVertexColor"),
  },
  uniformLocations: {
    projectionMatrix: glContext.getUniformLocation(
      glProgram,
      "uProjectionMatrix",
    ),
    modelViewMatrix: glContext.getUniformLocation(
      glProgram,
      "uModelViewMatrix",
    ),
  },
});
