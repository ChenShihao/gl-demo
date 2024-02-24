import "../common/reload";
import fragmentShader from "./glsl/fragment.glsl";
import vertexShader from "./glsl/vertex.glsl";
import { drawScene } from "./utils/drawScene.js";
import { initBufferItem } from "./utils/initBufferItem";
import { initProgram } from "./utils/initProgram";
import { initProgramInfo } from "./utils/initProgramInfo";
import { loadTexture } from "./utils/loadTexture";

const bootstrap = () => {
  const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
  const glContext = canvas.getContext("webgl");

  if (!glContext) {
    alert("WebGL Not Supported.");
    return;
  }

  const glProgram = initProgram(glContext, vertexShader, fragmentShader);
  const programInfo = initProgramInfo(glContext, glProgram);
  const bufferItem = initBufferItem(glContext);
  const stoneTexture = loadTexture(
    glContext,
    "./assets/stone_texture_512x512.jpg",
  );
  glContext.pixelStorei(glContext.UNPACK_FLIP_Y_WEBGL, true);

  const render = (now: number) => {
    const nowSec = now / 1000;

    drawScene(glContext, bufferItem, programInfo, stoneTexture, nowSec);

    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
};

bootstrap();
