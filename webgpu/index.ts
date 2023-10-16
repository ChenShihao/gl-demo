import FragmentShader from "./wgsl/fragment.wgsl";
import VertexShader from "./wgsl/vertex.wgsl";

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

  const encoder = device.createCommandEncoder();

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
    code: [VertexShader, FragmentShader].join("\n"),
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

  const GRID_SIZE = 4;
  const uniformArray = new Float32Array([GRID_SIZE, GRID_SIZE]);
  const uniformBuffer = device.createBuffer({
    label: "Grid Uniforms",
    size: uniformArray.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(uniformBuffer, 0, uniformArray);

  const bindGroup = device.createBindGroup({
    label: "Cell renderer bind group",
    layout: cellPipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: { buffer: uniformBuffer },
      },
    ],
  });

  pass.setPipeline(cellPipeline);
  pass.setVertexBuffer(0, vertexBuffer);
  pass.setBindGroup(0, bindGroup);
  pass.draw(vertices.length / 2, GRID_SIZE * GRID_SIZE);
  pass.end();

  device.queue.submit([encoder.finish()]);
};

void (async () => {
  await bootstrap();
})();
