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

  const WORKGROUP_SIZE = 8;
  const simulationShaderModule = device.createShaderModule({
    label: "Game of Life simulation shader",
    code: `
      @group(0) @binding(0) var<uniform> grid: vec2f;
      @group(0) @binding(1) var<storage> cellStateIn: array<u32>;
      @group(0) @binding(2) var<storage, read_write> cellStateOut: array<u32>;
      
      fn cellIndex(cell: vec2u) -> u32 {
        return cell.y * u32(grid.x) + cell.x;
      }
      
      @compute @workgroup_size(${WORKGROUP_SIZE}, ${WORKGROUP_SIZE})
      fn computeMain(@builtin(global_invocation_id) cell: vec3u){
        if (cellStateIn[cellIndex(cell.xy)] == 1) {
          cellStateOut[cellIndex(cell.xy)] = 0;
        } else {
          cellStateOut[cellIndex(cell.xy)] = 1;
        }
      }
    `,
  });
  const bindGroupLayout = device.createBindGroupLayout({
    label: "Cell Bind Group Layout",
    entries: [
      {
        binding: 0,
        visibility:
          GPUShaderStage.VERTEX |
          GPUShaderStage.COMPUTE |
          GPUShaderStage.FRAGMENT,
        buffer: {},
      },
      {
        binding: 1,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE,
        buffer: { type: "read-only-storage" },
      },
      {
        binding: 2,
        visibility: GPUShaderStage.COMPUTE,
        buffer: { type: "storage" },
      },
    ],
  });
  const bindGroups = [
    device.createBindGroup({
      label: "Cell renderer bind group A",
      layout: bindGroupLayout,
      entries: [
        { binding: 0, resource: { buffer: uniformBuffer } },
        { binding: 1, resource: { buffer: cellStateBuffers[0] } },
        { binding: 2, resource: { buffer: cellStateBuffers[1] } },
      ],
    }),
    device.createBindGroup({
      label: "Cell renderer bind group B",
      layout: bindGroupLayout,
      entries: [
        { binding: 0, resource: { buffer: uniformBuffer } },
        { binding: 1, resource: { buffer: cellStateBuffers[1] } },
        { binding: 2, resource: { buffer: cellStateBuffers[0] } },
      ],
    }),
  ];
  const pipelineLayout = device.createPipelineLayout({
    label: "Cell Pipeline Layout",
    bindGroupLayouts: [bindGroupLayout],
  });
  const cellPipeline = device.createRenderPipeline({
    label: "Cell pipeline",
    layout: pipelineLayout,
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
  const simulationPipeline = device.createComputePipeline({
    label: "Simulation pipeline",
    layout: pipelineLayout,
    compute: {
      module: simulationShaderModule,
      entryPoint: "computeMain",
    },
  });

  const UPDATE_INTERVAL = 500 as const;

  let step = 0;

  const updateGrid = () => {
    const encoder = device.createCommandEncoder();
    // Compute Pass
    const computePass = encoder.beginComputePass();
    computePass.setPipeline(simulationPipeline);
    computePass.setBindGroup(0, bindGroups[step % 2]);
    const workgroupCount = Math.ceil(GRID_SIZE / WORKGROUP_SIZE);
    computePass.dispatchWorkgroups(workgroupCount, workgroupCount);
    computePass.end();

    // Render Pass
    step++;
    const renderPass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: context.getCurrentTexture().createView(),
          loadOp: "clear",
          clearValue: [0, 0, 0.4, 1],
          storeOp: "store",
        },
      ],
    });
    renderPass.setPipeline(cellPipeline);
    renderPass.setVertexBuffer(0, vertexBuffer);
    renderPass.setBindGroup(0, bindGroups[step % 2]);
    renderPass.draw(vertices.length / 2, GRID_SIZE * GRID_SIZE);
    renderPass.end();

    device.queue.submit([encoder.finish()]);
  };

  setInterval(updateGrid, UPDATE_INTERVAL);
};

void (async () => {
  await bootstrap();
})();
