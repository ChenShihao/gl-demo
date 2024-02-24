import { type ProgramInfo } from "../interfaces/ProgramInfo";

export const initProgramInfo = (
  glContext: WebGLRenderingContext,
  glProgram: WebGLProgram,
): ProgramInfo => ({
  program: glProgram,
  attribLocations: {
    vertexPosition: glContext.getAttribLocation(glProgram, "aVertexPosition"),
    texture: glContext.getAttribLocation(glProgram, "aTexture"),
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
    uSampler: glContext.getUniformLocation(glProgram, "uSampler"),
  },
});
