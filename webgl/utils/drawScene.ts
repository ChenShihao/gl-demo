import { mat4 } from "gl-matrix";
import { type ProgramInfo } from "../interfaces/ProgramInfo";
import { type BufferItem } from "./initBufferItem";

const setPositionAttribute = (
  glContext: WebGLRenderingContext,
  bufferItem: BufferItem,
  programInfo: ProgramInfo,
) => {
  const numComponents = 2;
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

const setPositionColor = (
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

export const drawScene = (
  glContext: WebGLRenderingContext,
  bufferItem: BufferItem,
  programInfo: ProgramInfo,
) => {
  glContext.clearColor(0, 0, 0, 1);
  glContext.clearDepth(1);
  glContext.enable(glContext.DEPTH_TEST);
  glContext.depthFunc(glContext.LEQUAL);

  glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);

  const fieldOfView = (45 * Math.PI) / 180;
  const canvas = glContext.canvas as HTMLCanvasElement;
  const aspect = canvas.clientWidth / canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;

  const projectionMatrix = mat4.create();
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  const modelViewMatrix = mat4.create();
  mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);

  setPositionAttribute(glContext, bufferItem, programInfo);
  setPositionColor(glContext, bufferItem, programInfo);

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

  const offset = 0;
  const vertexCount = 4;
  glContext.drawArrays(glContext.TRIANGLE_STRIP, offset, vertexCount);
};
