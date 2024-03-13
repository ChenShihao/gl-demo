import "../common/reload";
import {
  BoxGeometry,
  BufferGeometry,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";

const renderer = new WebGLRenderer();
renderer.setSize(480, 480);

document.getElementById("canvas-wrapper")?.appendChild?.(renderer.domElement);

const rafHandlers: Record<"cube", number> = { cube: 0 };

const cleanRenderTasks = () => {
  Object.entries(rafHandlers).forEach(([key, handle]) => {
    cancelAnimationFrame(handle);
    rafHandlers[key as keyof typeof rafHandlers] = 0;
  });
};

const bindCubeButton = () => {
  const scene = new Scene();
  const camera = new PerspectiveCamera(75, 1, 0.1, 1000);
  const geometry = new BoxGeometry(1, 1, 1);
  const material = new MeshBasicMaterial({ color: 0x0000ff });
  const cube = new Mesh(geometry, material);
  scene.add(cube);
  camera.position.z = 2;

  const render = () => {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
    rafHandlers.cube = requestAnimationFrame(render);
  };

  document.getElementById("cube-button")?.addEventListener?.("click", () => {
    cleanRenderTasks();

    render();
  });
};

const getLineWithOffset = (material: LineBasicMaterial, offset: number = 0) => {
  const minifiedOffset = offset * 0.1;
  const points = [
    new Vector3(-10, 0 - minifiedOffset, 0),
    new Vector3(0, 10 - minifiedOffset, 0),
    new Vector3(10, 0 - minifiedOffset, 0),
  ];
  const geometry = new BufferGeometry().setFromPoints(points);
  return new Line(geometry, material);
};

const bindLineButton = () => {
  const camera = new PerspectiveCamera(45, 1, 1, 500);
  camera.position.set(0, 0, 50);
  camera.lookAt(0, 0, 0);
  const scene = new Scene();
  const material = new LineBasicMaterial({ color: "#fff" });
  scene.add(getLineWithOffset(material));
  scene.add(getLineWithOffset(material, 1));
  scene.add(getLineWithOffset(material, 2));

  document.getElementById("line-button")?.addEventListener?.("click", () => {
    cleanRenderTasks();

    renderer.render(scene, camera);
  });
};

bindCubeButton();
bindLineButton();
