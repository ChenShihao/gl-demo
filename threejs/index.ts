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

const renderer = new WebGLRenderer({
  antialias: true,
});
const size = 480;
renderer.setSize(size * devicePixelRatio, size * devicePixelRatio);
renderer.domElement.style.width = `${size}px`;
renderer.domElement.style.height = `${size}px`;

document.getElementById("canvas-wrapper")?.appendChild?.(renderer.domElement);

const PolygonGeometry = (sides: number) => {
  const geometry = new BufferGeometry();

  const points = [];
  const vertices = new Array(sides - 2)
    .fill(0)
    .map((v, index) => [0, index + 1, index + 2])
    .flat();

  for (let pt = 0; pt < sides; pt++) {
    const angle = Math.PI / 2 + (pt / sides) * 2 * Math.PI;
    const x = Math.cos(angle);
    const y = Math.sin(angle);
    points.push(new Vector3(x, y, 0));
  }
  geometry.setFromPoints(points);
  geometry.setIndex(vertices);

  return geometry;
};

const renderPolygon = (sides: number) => {
  renderer.clear();
  const polygonGeometry = PolygonGeometry(sides);
  const material = new MeshBasicMaterial({ color: "#33efdd", side: FrontSide });
  const mesh = new Mesh(polygonGeometry, material);
  const scene = new Scene();
  scene.add(mesh);
  const camera = new PerspectiveCamera(45, 1, 1, 1000);
  camera.position.set(0, 0, 3);
  renderer.render(scene, camera);
};

let sides = 3;

renderPolygon(sides);

renderer.domElement.addEventListener("wheel", (event) => {
  sides = Math.max(event.deltaY > 0 ? --sides : ++sides, 3);
  renderPolygon(sides);
});
