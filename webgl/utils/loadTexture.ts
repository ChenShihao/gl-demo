import { isPowerOf2 } from "./isPowerOf2";

export const loadTexture = (glContext: WebGLRenderingContext, url: string) => {
  const texture = glContext.createTexture();
  glContext.bindTexture(glContext.TEXTURE_2D, texture);

  const level = 0;
  const internalFormat = glContext.RGBA;
  const srcFormat = glContext.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcType = glContext.UNSIGNED_BYTE;
  const pixels = new Uint8Array([0, 0, 0, 0]);

  glContext.texImage2D(
    glContext.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixels,
  );

  const image = new Image();
  image.onload = () => {
    glContext.bindTexture(glContext.TEXTURE_2D, texture);
    glContext.texImage2D(
      glContext.TEXTURE_2D,
      level,
      internalFormat,
      srcFormat,
      srcType,
      image,
    );

    // WebGL1 has different requirements for different image size.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      glContext.generateMipmap(glContext.TEXTURE_2D);
    } else {
      glContext.texParameterf(
        glContext.TEXTURE_2D,
        glContext.TEXTURE_WRAP_S,
        glContext.CLAMP_TO_EDGE,
      );
      glContext.texParameterf(
        glContext.TEXTURE_2D,
        glContext.TEXTURE_WRAP_T,
        glContext.CLAMP_TO_EDGE,
      );
      glContext.texParameterf(
        glContext.TEXTURE_2D,
        glContext.TEXTURE_MIN_FILTER,
        glContext.LINEAR,
      );
    }
  };

  image.src = url;

  return texture;
};
