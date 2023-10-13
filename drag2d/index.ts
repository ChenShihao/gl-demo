import { throttle } from "lodash-es";

const initCanvasSize = throttle(() => {
  const canvas = getCanvas();
  const clientRect = canvas.getBoundingClientRect();
  canvas.width = clientRect.width;
  canvas.height = clientRect.height;
}, 100);

const drawBackground = () => {
  const canvas = getCanvas();
  const context = getContext();
  context.fillStyle = "#eee";
  context.fillRect(0, 0, canvas.width, canvas.height);
};

const drawTitle = () => {
  const context = getContext();
  context.fillStyle = "black";
  context.font = "18px Serif";
  context.textBaseline = "top";
  context.fillText("Drag Demo. By shihao.chen", 12, 12);
};

class Point {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

const cleanFull = () => {
  const canvas = getCanvas();
  const context = getContext();
  context.clearRect(0, 0, canvas.width, canvas.height);
};

const initAround = () => {
  cleanFull();
  drawBackground();
  drawTitle();
};

const getCanvas = () => document.getElementById("canvas") as HTMLCanvasElement;

const getContext = (): CanvasRenderingContext2D => {
  const canvas = getCanvas();

  if (!canvas?.getContext) {
    throw Error("Not Supported.");
  }

  return canvas.getContext("2d") as CanvasRenderingContext2D;
};

const getInRange = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const drawLine = (startPoint: Point, endPoint: Point, color = "black") => {
  const context = getContext();
  const line = new Path2D();
  line.moveTo(startPoint.x, startPoint.y);
  line.lineTo(endPoint.x, endPoint.y);
  context.strokeStyle = color || "black";
  context.lineWidth = 20;
  context.stroke(line);
  return line;
};

const drawCircle = (point: Point, color = "black") => {
  const canvas = getCanvas();
  const context = getContext();
  const circle = new Path2D();
  const RADIUS = 50;
  circle.arc(
    getInRange(point.x, RADIUS, canvas.width - RADIUS),
    getInRange(point.y, RADIUS, canvas.height - RADIUS),
    RADIUS,
    0,
    2 * Math.PI,
  );
  context.fillStyle = color || "black";
  context.fill(circle);
  return circle;
};

const buildCircleState = () => {
  const point = new Point(500, 100);
  return {
    point,
    circle: drawCircle(point),
    dragging: false,
    dragDeltaX: 0,
    dragDeltaY: 0,
  };
};

function buildLineState() {
  const LINE_OFFSET = 200;
  const START_X = 100;
  const START_Y = 100;
  const lineStartPoint = new Point(START_X, START_Y);
  const lineEndPoint = new Point(START_X + LINE_OFFSET, START_Y + LINE_OFFSET);
  const line = drawLine(lineStartPoint, lineEndPoint);

  return {
    line,
    lineStartPoint,
    lineEndPoint,
    lineOffset: LINE_OFFSET,
    dragging: false,
    dragDeltaX: 0,
    dragDeltaY: 0,
  };
}

const bootstrap = () => {
  initCanvasSize();
  initAround();

  const canvas = getCanvas();
  const context = getContext();
  const circleState = buildCircleState();
  const lineState = buildLineState();

  canvas.addEventListener("mousemove", (event: MouseEvent) => {
    initAround();

    const isPointInLine = context.isPointInStroke(
      lineState.line,
      event.offsetX,
      event.offsetY,
    );

    const isPointInCircle = context.isPointInPath(
      circleState.circle,
      event.offsetX,
      event.offsetY,
    );

    canvas.style.cursor =
      circleState.dragging || isPointInLine || isPointInCircle
        ? "grab"
        : "default";

    if (lineState.dragging) {
      lineState.lineStartPoint = new Point(
        event.offsetX - lineState.dragDeltaX,
        event.offsetY - lineState.dragDeltaY,
      );
      lineState.lineEndPoint = new Point(
        lineState.lineStartPoint.x + lineState.lineOffset,
        lineState.lineStartPoint.y + lineState.lineOffset,
      );
    }

    if (circleState.dragging) {
      circleState.point = new Point(
        event.offsetX - circleState.dragDeltaX,
        event.offsetY - circleState.dragDeltaY,
      );
    }

    const highlightColor = "purple";

    lineState.line = drawLine(
      lineState.lineStartPoint,
      lineState.lineEndPoint,
      !circleState.dragging && (lineState.dragging || isPointInLine)
        ? highlightColor
        : undefined,
    );

    circleState.circle = drawCircle(
      circleState.point,
      !lineState.dragging && (circleState.dragging || isPointInCircle)
        ? highlightColor
        : undefined,
    );
  });
  canvas.addEventListener("mousedown", (event: MouseEvent) => {
    const isPointInCircle = context.isPointInPath(
      circleState.circle,
      event.offsetX,
      event.offsetY,
    );

    if (isPointInCircle) {
      circleState.dragging = true;
      // Drag Circle Point Delta
      circleState.dragDeltaX = event.offsetX - circleState.point.x;
      circleState.dragDeltaY = event.offsetY - circleState.point.y;
      return;
    }

    const isPointInLine = context.isPointInStroke(
      lineState.line,
      event.offsetX,
      event.offsetY,
    );

    if (isPointInLine) {
      lineState.dragging = true;
      // Drag Line Point Delta
      lineState.dragDeltaX = event.offsetX - lineState.lineStartPoint.x;
      lineState.dragDeltaY = event.offsetY - lineState.lineStartPoint.y;
    }
  });
  canvas.addEventListener("mouseup", () => {
    lineState.dragging = false;
    circleState.dragging = false;
  });

  addEventListener("resize", initCanvasSize);
};

addEventListener("load", () => bootstrap());
