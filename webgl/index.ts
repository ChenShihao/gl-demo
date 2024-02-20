import "../common/reload";
import fragmentShader from "./glsl/fragment.glsl";
import vertexShader from "./glsl/vertex.glsl";
import { type ProgramInfo } from "./interfaces/ProgramInfo.js";
import { drawScene } from "./utils/drawScene.js";
import { initBuffers } from "./utils/initBuffers.js";
import { initProgram } from "./utils/initProgram";

const bootstrap = () => {
  const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
  const glContext = canvas.getContext("webgl");

  if (!glContext) {
    alert("WebGL Not Supported.");
    return;
  }

  const shaderProgram = initProgram(glContext, vertexShader, fragmentShader);
  const programInfo: ProgramInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: glContext.getAttribLocation(
        shaderProgram,
        "aVertexPosition",
      ),
    },
    uniformLocations: {
      projectionMatrix: glContext.getUniformLocation(
        shaderProgram,
        "uProjectionMatrix",
      ),
      modelViewMatrix: glContext.getUniformLocation(
        shaderProgram,
        "uModelViewMatrix",
      ),
    },
  };
  const buffers = initBuffers(glContext);

  drawScene(glContext, programInfo, buffers);
};

bootstrap();
