export const loadShader = (
  glContext: WebGLRenderingContext,
  type: GLenum,
  source: string,
) => {
  const shader = glContext.createShader(type);

  if (!shader) {
    throw Error("Create Shader Failed.");
  }

  glContext.shaderSource(shader, source);
  glContext.compileShader(shader);

  if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
    glContext.deleteShader(shader);
    throw Error("Compile Shader Failed. " + glContext.getShaderInfoLog(shader));
  }

  return shader;
};
