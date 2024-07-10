import React, { useEffect, useRef, useState } from "react";
import { getSafeValueInRange } from "../../common/range";
import fragmentShader from "../glsl/fragment.glsl";
import vertexShader from "../glsl/vertex.glsl";
import {
  drawScene,
  type DrawSceneParams,
  type TransformState,
} from "../utils/drawScene";
import { initBufferItem } from "../utils/initBufferItem";
import { initProgram } from "../utils/initProgram";
import { initProgramInfo } from "../utils/initProgramInfo";
import { loadTexture } from "../utils/loadTexture";
import { setCanvasSize } from "../utils/setCanvasSize";
import { ControlBox } from "./ControlBox";

export const Root = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawSceneParams, setDrawSceneParams] = useState<DrawSceneParams>();
  const [transformState, setTransformState] = useState<TransformState>({
    cameraDistance: 8.0,
    translateX: 0,
    translateY: 0,
    rotateX: 0,
    rotateY: 0,
    fovDegree: 60,
  });

  let rafId: number;

  const draggingState = {
    left: false,
    right: false,
  };

  const initCanvas = (
    glContext: WebGLRenderingContext,
    canvas: HTMLCanvasElement,
  ) => {
    setCanvasSize(canvas, glContext);

    const glProgram = initProgram(glContext, vertexShader, fragmentShader);
    const programInfo = initProgramInfo(glContext, glProgram);
    const bufferItem = initBufferItem(glContext);
    const texture = loadTexture(
      glContext,
      "https://fakeimg.pl/1024x1024/282828/eae0d0/?retina=1&text=Oho?%20%3C%3Apepw%3A989410572514758676%3E",
    );

    setDrawSceneParams({
      glContext,
      bufferItem,
      programInfo,
      texture,
      transformState,
    });

    glContext.pixelStorei(glContext.UNPACK_FLIP_Y_WEBGL, true);

    // 支持缩放变换
    canvas.addEventListener("wheel", (event) => {
      const deltaCameraDistance = event.deltaY / 200 || 0;
      setTransformState((state) => ({
        ...state,
        cameraDistance: Math.max(
          state.cameraDistance + deltaCameraDistance,
          3.0,
        ),
      }));
    });

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
        setTransformState((state) => ({
          ...state,
          translateX: state.translateX + event.movementX / 100,
          translateY: state.translateY - event.movementY / 100,
        }));
      } else if (draggingState.left) {
        const safeRotate = (Math.PI * 3) / 8;
        setTransformState((state) => ({
          ...state,
          rotateX: getSafeValueInRange(
            state.rotateX + event.movementY / 100,
            -safeRotate,
            safeRotate,
          ),
          rotateY: state.rotateY + event.movementX / 100,
        }));
      }
    });

    canvas.addEventListener("mouseup", () => {
      draggingState.left = false;
      draggingState.right = false;
    });

    canvas.addEventListener("mouseout", () => {
      draggingState.left = false;
      draggingState.right = false;
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const glContext = canvas.getContext("webgl");

    if (!glContext) {
      alert("WebGL Not Supported.");
      return;
    }

    initCanvas(glContext, canvas);
  }, [canvasRef]);

  useEffect(() => {
    if (!drawSceneParams) return;

    const render = () => {
      drawScene({
        ...drawSceneParams,
        transformState,
      });

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      if (!rafId) return;

      cancelAnimationFrame(rafId);
    };
  }, [transformState, drawSceneParams]);

  return (
    <>
      <canvas ref={canvasRef} />
      <ControlBox
        transformState={transformState}
        setTransformState={setTransformState}
      />
    </>
  );
};
