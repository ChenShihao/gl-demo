import { mat4 } from "gl-matrix";
import { type BufferItem } from "../interfaces/BufferItem";
import { type ProgramInfo } from "../interfaces/ProgramInfo";

const setPositionAttribute = (
  glContext: WebGLRenderingContext,
  bufferItem: BufferItem,
  programInfo: ProgramInfo,
) => {
  glContext.bindBuffer(glContext.ARRAY_BUFFER, bufferItem.position);
  glContext.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    3,
    glContext.FLOAT,
    false,
    0,
    0,
  );
  glContext.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
};

const setTextureAttribute = (
  glContext: WebGLRenderingContext,
  bufferItem: BufferItem,
  programInfo: ProgramInfo,
) => {
  glContext.bindBuffer(glContext.ARRAY_BUFFER, bufferItem.texture);
  glContext.vertexAttribPointer(
    programInfo.attribLocations.texture,
    2,
    glContext.FLOAT,
    false,
    0,
    0,
  );
  glContext.enableVertexAttribArray(programInfo.attribLocations.texture);
};

export const drawScene = (
  glContext: WebGLRenderingContext,
  bufferItem: BufferItem,
  programInfo: ProgramInfo,
  texture: WebGLTexture | null,
  cubeRotation = 0,
) => {
  glContext.clearColor(0, 0, 0, 1);
  glContext.clearDepth(1);
  glContext.enable(glContext.DEPTH_TEST);
  glContext.depthFunc(glContext.LEQUAL);

  glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);

  const canvas = glContext.canvas as HTMLCanvasElement;
  const aspect = canvas.clientWidth / canvas.clientHeight;

  const projectionMatrix = mat4.create();
  mat4.perspective(projectionMatrix, (45 * Math.PI) / 180, aspect, 0.1, 100.0);

  const modelViewMatrix = mat4.create();
  mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);
  mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation, [1, 0, 0]);
  mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation * 0.7, [0, 1, 0]);
  mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation * 0.3, [0, 0, 1]);

  setPositionAttribute(glContext, bufferItem, programInfo);
  setTextureAttribute(glContext, bufferItem, programInfo);

  glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, bufferItem.indices);

  glContext.useProgram(programInfo.program);
  glContext.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix,
  );
  glContext.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix,
  );

  glContext.activeTexture(glContext.TEXTURE0);
  glContext.bindTexture(glContext.TEXTURE_2D, texture);
  glContext.uniform1i(programInfo.uniformLocations.uSampler, 0);

  glContext.drawElements(glContext.TRIANGLES, 36, glContext.UNSIGNED_SHORT, 0);
};
