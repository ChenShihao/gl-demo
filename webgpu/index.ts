import Shader from "./index.wgsl";

const bootstrap = async () => {
  if (!navigator.gpu) {
    throw new Error("WebGPU not supported on this browser.");
  }

  console.time("Request Adapter");
  const adapter = await navigator.gpu.requestAdapter({
    powerPreference: "high-performance",
  });
  console.timeEnd("Request Adapter");

  if (!adapter) {
    throw new Error("No appropriate GPUAdapter found.");
  }

  console.time("Request Device");
  const device = await adapter.requestDevice();
  console.timeEnd("Request Device");

  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  if (!canvas) {
    throw new Error("Canvas Not Found.");
  }

  const context = canvas.getContext("webgpu");
  if (!context) {
    throw new Error("Canvas Context Not Found.");
  }

  const format = navigator.gpu.getPreferredCanvasFormat();
  context.configure({
    device,
    format,
  });

  const vertices = new Float32Array([
    // Triangle Bottom-Right
    -0.8, -0.8,

    0.8, -0.8,

    0.8, 0.8,

    // Triangle Top-Left
    0.8, 0.8,

    -0.8, 0.8,

    -0.8, -0.8,
  ]);

  const vertexBuffer = device.createBuffer({
    label: "Cell Vertices",
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(vertexBuffer, 0, vertices);

  const vertexBufferLayout: GPUVertexBufferLayout = {
    arrayStride: 8,
    attributes: [
      {
        format: "float32x2",
        offset: 0,
        shaderLocation: 0,
      },
    ],
  };

  const cellShaderModule = device.createShaderModule({
    label: "Cell Shader",
    code: Shader,
  });

  const cellPipeline = device.createRenderPipeline({
    label: "Cell pipeline",
    layout: "auto",
    vertex: {
      module: cellShaderModule,
      entryPoint: "vertexMain",
      buffers: [vertexBufferLayout],
    },
    fragment: {
      module: cellShaderModule,
      entryPoint: "fragmentMain",
      targets: [{ format }],
    },
  });

  const GRID_SIZE = 32;

  const cellStateArray = new Uint32Array(GRID_SIZE * GRID_SIZE);
  const cellStateBuffers = [
    device.createBuffer({
      label: "Cell State A",
      size: cellStateArray.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    }),
    device.createBuffer({
      label: "Cell State B",
      size: cellStateArray.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    }),
  ];

  for (let i = 0; i < cellStateArray.length; i += 3) {
    cellStateArray[i] = 1;
  }
  device.queue.writeBuffer(cellStateBuffers[0], 0, cellStateArray);

  for (let i = 0; i < cellStateArray.length; i++) {
    cellStateArray[i] = i % 2;
  }
  device.queue.writeBuffer(cellStateBuffers[1], 0, cellStateArray);

  const uniformArray = new Float32Array([GRID_SIZE, GRID_SIZE]);
  const uniformBuffer = device.createBuffer({
    label: "Grid Uniforms",
    size: uniformArray.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(uniformBuffer, 0, uniformArray);

  const bindGroups = [
    device.createBindGroup({
      label: "Cell renderer bind group A",
      layout: cellPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: uniformBuffer } },
        { binding: 1, resource: { buffer: cellStateBuffers[0] } },
      ],
    }),
    device.createBindGroup({
      label: "Cell renderer bind group B",
      layout: cellPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: uniformBuffer } },
        { binding: 1, resource: { buffer: cellStateBuffers[1] } },
      ],
    }),
  ];

  const UPDATE_INTERVAL = 500 as const;

  let step = 0;

  const updateGrid = () => {
    step++;

    const encoder = device.createCommandEncoder();
    const pass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: context.getCurrentTexture().createView(),
          loadOp: "clear",
          clearValue: [0, 0, 0.4, 1],
          storeOp: "store",
        },
      ],
    });

    pass.setPipeline(cellPipeline);
    pass.setVertexBuffer(0, vertexBuffer);
    pass.setBindGroup(0, bindGroups[step % 2]);
    pass.draw(vertices.length / 2, GRID_SIZE * GRID_SIZE);
    pass.end();

    device.queue.submit([encoder.finish()]);
  };

  setInterval(updateGrid, UPDATE_INTERVAL);
};

void (async () => {
  await bootstrap();
})();
