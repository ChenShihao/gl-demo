interface AttribLocations {
  vertexPosition: GLint;
  texture: GLint;
}

interface UniformLocations {
  projectionMatrix: WebGLUniformLocation | null;
  modelViewMatrix: WebGLUniformLocation | null;
  uSampler: WebGLUniformLocation | null;
}

export interface ProgramInfo {
  program: WebGLProgram;
  attribLocations: AttribLocations;
  uniformLocations: UniformLocations;
}
