interface AttribLocations {
  vertexPosition: GLint;
}

interface UniformLocations {
  projectionMatrix: WebGLUniformLocation | null;
  modelViewMatrix: WebGLUniformLocation | null;
}

export interface ProgramInfo {
  program: WebGLProgram;
  attribLocations: AttribLocations;
  uniformLocations: UniformLocations;
}
