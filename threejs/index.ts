import "../common/reload";
import {
  BufferGeometry,
  FrontSide,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";

interface Location {
  x: number;
  y: number;
}

const renderer = new WebGLRenderer({
  antialias: true,
});
const size = 480;
renderer.setSize(size * devicePixelRatio, size * devicePixelRatio);
renderer.domElement.style.width = `${size}px`;
renderer.domElement.style.height = `${size}px`;

document.getElementById("canvas-wrapper")?.appendChild?.(renderer.domElement);

const buildPolygonGeometry = (
  sides: number,
  radius: number,
  location: Location,
) => {
  const geometry = new BufferGeometry();

  const points = [];
  const vertices = new Array(sides - 2)
    .fill(0)
    .map((v, index) => [0, index + 1, index + 2])
    .flat();

  for (let pt = 0; pt < sides; pt++) {
    const angle = Math.PI / 2 + (pt / sides) * 2 * Math.PI;
    const x = radius * Math.cos(angle) + location.x;
    const y = radius * Math.sin(angle) + location.y;
    points.push(new Vector3(x, y, 0));
  }
  geometry.setFromPoints(points);
  geometry.setIndex(vertices);

  return geometry;
};

let sides = 3;
let radius = 1;
const location = { x: 0, y: 0 };

const renderPolygon = () => {
  renderer.clear();
  const polygonGeometry = buildPolygonGeometry(sides, radius, location);
  const material = new MeshBasicMaterial({ color: "#33efdd", side: FrontSide });
  const mesh = new Mesh(polygonGeometry, material);
  const scene = new Scene();
  scene.add(mesh);
  const camera = new PerspectiveCamera(45, 1, 10, 1000);
  camera.position.set(0, 0, 10);
  renderer.render(scene, camera);
};

const dragState = { left: false };

renderPolygon();

renderer.domElement.addEventListener("wheel", (event) => {
  if (event.altKey) {
    sides = Math.max(event.deltaY > 0 ? --sides : ++sides, 3);
  } else {
    radius = Math.max(event.deltaY > 0 ? radius - 0.1 : radius + 0.1, 1);
  }
  renderPolygon();
});

renderer.domElement.addEventListener("mousedown", () => {
  dragState.left = true;
});

renderer.domElement.addEventListener("mouseup", () => {
  dragState.left = false;
});

renderer.domElement.addEventListener("mousemove", (event) => {
  if (!dragState.left) return;

  location.x += event.movementX / 120;
  location.y -= event.movementY / 120;
  renderPolygon();
});
