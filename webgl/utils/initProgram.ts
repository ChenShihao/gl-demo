import { loadShader } from "./loadShader";

export const initProgram = (
  glContext: WebGLRenderingContext,
  vertexShaderSource: string,
  fragmentShaderSource: string,
) => {
  const vertexShader = loadShader(
    glContext,
    glContext.VERTEX_SHADER,
    vertexShaderSource,
  );
  const fragmentShader = loadShader(
    glContext,
    glContext.FRAGMENT_SHADER,
    fragmentShaderSource,
  );

  const program = glContext.createProgram();

  if (!program) {
    throw Error("Create Program Failed.");
  }

  glContext.attachShader(program, vertexShader);
  glContext.attachShader(program, fragmentShader);
  glContext.linkProgram(program);

  if (!glContext.getProgramParameter(program, glContext.LINK_STATUS)) {
    throw Error("Link Shader Program Failed.");
  }

  return program;
};
