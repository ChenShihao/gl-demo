import "../common/reload";
import fragmentShader from "./glsl/fragment.glsl";
import vertexShader from "./glsl/vertex.glsl";
import { drawScene } from "./utils/drawScene.js";
import { initBufferItem } from "./utils/initBufferItem";
import { initProgram } from "./utils/initProgram";
import { initProgramInfo } from "./utils/initProgramInfo";

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

  drawScene(glContext, bufferItem, programInfo);
};

bootstrap();
