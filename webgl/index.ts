import "../common/reload";
import fragmentShader from "./glsl/fragment.glsl";
import vertexShader from "./glsl/vertex.glsl";
import { drawScene, type TransformState } from "./utils/drawScene.js";
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
  const texture = loadTexture(glContext, "./assets/stone_texture_512x512.jpg");
  glContext.pixelStorei(glContext.UNPACK_FLIP_Y_WEBGL, true);
  const transformState: TransformState = {
    cameraDistance: 8.0,
    translateX: 0,
    translateY: 0,
    rotateX: Math.random(),
    rotateY: Math.random(),
  };

  const render = () => {
    drawScene({
      glContext,
      bufferItem,
      programInfo,
      texture,
      transformState,
    });

    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);

  // 支持缩放变换
  canvas.addEventListener("wheel", (event) => {
    const deltaCameraDistance = event.deltaY / 1000 || 0;
    transformState.cameraDistance = Math.max(
      transformState.cameraDistance + deltaCameraDistance,
      3.0,
    );
  });

  const draggingState = {
    left: false,
    right: false,
  };

  // 支持旋转变换
  canvas.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  canvas.addEventListener("mousedown", (event) => {
    switch (event.button) {
      case 0:
        draggingState.left = true;
        break;
      case 2:
        draggingState.right = true;
        break;
      default:
        break;
    }
  });

  canvas.addEventListener("mousemove", (event) => {
    if (draggingState.right) {
      transformState.translateX =
        transformState.translateX + event.movementX / 100;
      transformState.translateY =
        transformState.translateY - event.movementY / 100;
    } else if (draggingState.left) {
      transformState.rotateX = transformState.rotateX + event.movementY / 100;
      transformState.rotateY = transformState.rotateY + event.movementX / 100;
    }
  });

  canvas.addEventListener("mouseup", (event) => {
    draggingState.left = false;
    draggingState.right = false;
  });
};

bootstrap();
