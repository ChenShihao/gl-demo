import { mat4 } from "gl-matrix";
import { type ProgramInfo } from "../interfaces/ProgramInfo";
import { type BufferItem } from "./initBufferItem";

const setPositionAttribute = (
  glContext: WebGLRenderingContext,
  bufferItem: BufferItem,
  programInfo: ProgramInfo,
) => {
  const numComponents = 3;
  const type = glContext.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;

  glContext.bindBuffer(glContext.ARRAY_BUFFER, bufferItem.position);
  glContext.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset,
  );
  glContext.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
};

const setColorAttribute = (
  glContext: WebGLRenderingContext,
  bufferItem: BufferItem,
  programInfo: ProgramInfo,
) => {
  const numComponents = 4;
  const type = glContext.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;

  glContext.bindBuffer(glContext.ARRAY_BUFFER, bufferItem.color);
  glContext.vertexAttribPointer(
    programInfo.attribLocations.vertexColor,
    numComponents,
    type,
    normalize,
    stride,
    offset,
  );
  glContext.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
};

const setIndices = (
  glContext: WebGLRenderingContext,
  bufferItem: BufferItem,
) => {
  glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, bufferItem.indices);
};

export const drawScene = (
  glContext: WebGLRenderingContext,
  bufferItem: BufferItem,
  programInfo: ProgramInfo,
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
  setColorAttribute(glContext, bufferItem, programInfo);
  setIndices(glContext, bufferItem);

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

  glContext.drawElements(glContext.TRIANGLES, 36, glContext.UNSIGNED_SHORT, 0);
};
