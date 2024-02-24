import { type BufferItem } from "../interfaces/BufferItem";
import { initColorBuffer } from "./initColorBuffer";
import { initIndexBuffer } from "./initIndexBuffer";
import { initPositionBuffer } from "./initPositionBuffer";
import { initTextureBuffer } from "./initTextureBuffer";

export const initBufferItem = (
  glContext: WebGLRenderingContext,
): BufferItem => {
  const positionBuffer = initPositionBuffer(glContext);
  const indexBuffer = initIndexBuffer(glContext);
  const textureBuffer = initTextureBuffer(glContext);

  return {
    position: positionBuffer,
    indices: indexBuffer,
    texture: textureBuffer,
  };
};
