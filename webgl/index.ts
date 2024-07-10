import "../common/reload";
import { getSafeValueInRange } from "../common/range";
import fragmentShader from "./glsl/fragment.glsl";
import vertexShader from "./glsl/vertex.glsl";
import { drawScene, type TransformState } from "./utils/drawScene.js";
import { initBufferItem } from "./utils/initBufferItem";
import { initProgram } from "./utils/initProgram";
import { initProgramInfo } from "./utils/initProgramInfo";
import { loadTexture } from "./utils/loadTexture";

const setCanvasSize = (
  canvas: HTMLCanvasElement,
  glContext: WebGLRenderingContext,
) => {
  const DISPLAY_SIZE = 640 as const;
  const RENDER_SIZE = DISPLAY_SIZE * (devicePixelRatio || 1);

  canvas.width = RENDER_SIZE;
  canvas.height = RENDER_SIZE;
  canvas.style.width = `${DISPLAY_SIZE}px`;
  canvas.style.height = `${DISPLAY_SIZE}px`;

  glContext.viewport(0, 0, canvas.width, canvas.height);
};

const bootstrap = () => {
  const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
  const glContext = canvas.getContext("webgl");

  if (!glContext) {
    alert("WebGL Not Supported.");
    return;
  }

  setCanvasSize(canvas, glContext);

  const glProgram = initProgram(glContext, vertexShader, fragmentShader);
  const programInfo = initProgramInfo(glContext, glProgram);
  const bufferItem = initBufferItem(glContext);
  const texture = loadTexture(
    glContext,
    "https://fakeimg.pl/1024x1024/282828/eae0d0/?retina=1&text=Oho?%20%3C%3Apepw%3A989410572514758676%3E",
  );
  glContext.pixelStorei(glContext.UNPACK_FLIP_Y_WEBGL, true);
  const transformState: TransformState = {
    cameraDistance: 8.0,
    translateX: 0,
    translateY: 0,
    rotateX: 0,
    rotateY: 0,
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
    const deltaCameraDistance = event.deltaY / 200 || 0;
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
      const safeRotate = (Math.PI * 3) / 8;
      transformState.rotateX = getSafeValueInRange(
        (transformState.rotateX + event.movementY / 100) % (Math.PI * 2),
        -safeRotate,
        safeRotate,
      );
      transformState.rotateY =
        (transformState.rotateY + event.movementX / 100) % (Math.PI * 2);
    }
  });

  canvas.addEventListener("mouseup", (event) => {
    draggingState.left = false;
    draggingState.right = false;
  });

  canvas.addEventListener("mouseout", (event) => {
    draggingState.left = false;
    draggingState.right = false;
  });
};

bootstrap();
