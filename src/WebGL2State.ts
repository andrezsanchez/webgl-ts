export enum WebGL2ArrayBufferTarget {
  ARRAY_BUFFER,
  ELEMENT_ARRAY_BUFFER,
}

export type GLsize = number;
export type GLint = number;
export type WebGLUniformLocation = GLint;

export enum WebGL2BufferUsage {
  STREAM_DRAW,
  STREAM_READ,
  STREAM_COPY,
  STATIC_DRAW,
  STATIC_READ,
  STATIC_COPY,
  DYNAMIC_DRAW,
  DYNAMIC_READ,
  DYNAMIC_COPY,
}

export enum WebGL2ErrorType {
  NO_ERROR,
  INVALID_ENUM,
  INVALID_VALUE,
  INVALID_OPERATION,
}

export interface WebGL2ArrayBuffer {
  data: Uint8Array;
  size: GLsize;
  usage: WebGL2BufferUsage;
}

export interface WebGL2VertexArray {
  pointers: Map<number, WebGL2VertexAttribute>;
  elementBuffer: WebGL2ArrayBuffer | null;
}

export interface WebGL2VertexAttributePointer {
  buffer: WebGL2ArrayBuffer;
  elementSize: number;
  offset: number;
  stride: number;
  normalized: boolean;
  type: WebGL2DataType;
}

export interface WebGL2VertexAttribute {
  index: number;
  enabled: boolean;
  pointer: WebGL2VertexAttributePointer | null;
  // divisor?
}

export interface WebGL2Program {
  code: string;
}

export const GL_MAX_VERTEX_ATTRIBS = 1024;

export interface WebGL2Error {
  type: WebGL2ErrorType;
  message: string;
}

export enum WebGL2DataType {
  FLOAT,
}

export enum WebGL2Face {
  FRONT,
  BACK,
  FRONT_AND_BACK,
}

export enum WebGL2Capability {
  BLEND,
  CULL_FACE,
  DEPTH_TEST,
  DITHER,
  POLYGON_OFFSET_FILL,
  SAMPLE_ALPHA_TO_COVERAGE,
  SAMPLE_COVERAGE,
  SCISSOR_TEST,
  STENCIL_TEST,
  RASTERIZER_DISCARD,
}

export enum WebGL2FrontFace {
  CW,
  CCW,
}

export enum WebGL2Parameter {
  BLEND_SRC_RGB,
  BLEND_SRC_ALPHA,
  BLEND_DEST_RGB,
  BLEND_DEST_ALPHA,
  BLEND_EQUATION_RGB,
  BLEND_EQUATION_ALPHA,
  CULL_FACE,
  DEPTH_FUNC,
  DEPTH_RANGE,
  DEPTH_MASK,
  LINE_WIDTH,
  ALIASED_LINE_WIDTH_RANGE,
  VIEWPORT,
  STENCIL_TEST,
  STENCIL_FUNC,
  STENCIL_BACK_FUNC,
  STENCIL_VALUE_MASK,
  STENCIL_BACK_VALUE_MASK,
  STENCIL_REF,
  STENCIL_BACK_REF,
  STENCIL_WRITEMASK,
  STENCIL_BACK_WRITEMASK,
  STENCIL_FAIL,
  STENCIL_PASS_DEPTH_PASS,
  STENCIL_PASS_DEPTH_FAIL,
  STENCIL_BACK_FAIL,
  STENCIL_BACK_PASS_DEPTH_PASS,
  STENCIL_BACK_PASS_DEPTH_FAIL,
  STENCIL_BITS,
}

export enum WebGL2BlendFunc {
  ZERO,
  ONE,
  SRC_COLOR,
  ONE_MINUS_SRC_COLOR,
  DST_COLOR,
  ONE_MINUS_DST_COLOR,
  SRC_ALPHA,
  ONE_MINUS_SRC_ALPHA,
  DST_ALPHA,
  ONE_MINUS_DST_ALPHA,
  CONSTANT_COLOR,
  ONE_MINUS_CONSTANT_COLOR,
  CONSTANT_ALPHA,
  ONE_MINUS_CONSTANT_ALPHA,
  SRC_ALPHA_SATURATE,
}

export interface WebGL2BlendFuncs {
  sFactorRGB: WebGL2BlendFunc;
  sFactorA: WebGL2BlendFunc;
  dFactorRGB: WebGL2BlendFunc;
  dFactorA: WebGL2BlendFunc;
}

export enum WebGL2BlendEquation {
  FUNC_ADD,
  FUNC_REVERSE,
  FUNC_REVERSE_SUBTRACT,
  MIN,
  MAX,
}

export interface WebGL2BlendEquations {
  modeRGB: WebGL2BlendEquation;
  modeA: WebGL2BlendEquation;
}

export enum WebGL2ComparisonFunc {
  NEVER,
  LESS,
  EQUAL,
  LEQUAL,
  GREATER,
  NOTEQUAL,
  GEQUAL,
  ALWAYS,
}

export interface WebGL2StencilTest {
  func: WebGL2ComparisonFunc,
  mask: number,
  ref: number,
}

export interface WebGL2StencilTests {
  front: WebGL2StencilTest;
  back: WebGL2StencilTest;
}

export interface WebGL2StencilMasks {
  front: number;
  back: number;
}

export enum WebGL2StencilOp {
  KEEP = 0x1E00,
  REPLACE = 0x1E01,
  INCR = 0x1E02,
  DECR = 0x1E03,
  INVERT = 0x150A,
  INCR_WRAP = 0x8507,
  DECR_WRAP = 0x8508,
}

export interface WebGL2StencilOpSide {
  fail: WebGL2StencilOp;
  zfail: WebGL2StencilOp;
  zpass: WebGL2StencilOp;
}

export interface WebGL2StencilOps {
  front: WebGL2StencilOpSide;
  back: WebGL2StencilOpSide;
}

export interface WebGL2State {
  defaultVertexArray: WebGL2VertexArray;

  // Bound objects
  vertexArray: WebGL2VertexArray;
  arrayBuffer: WebGL2ArrayBuffer | null;

  // Global vertex attribute values
  vertexAttributes: Map<number, Float32Array>;

  bufferSet: Set<WebGL2ArrayBuffer>;
  vertexArraySet: Set<WebGL2VertexArray>;
  error: WebGL2Error | null;
  blendColor: [number, number, number, number];
  clearColor: [number, number, number, number];
  clearDepth: number;
  clearStencil: number;
  polygonOffsetFactor: number;
  polygonOffsetUnits: number;
  viewport: [number, number, number, number];
  colorMask: [boolean, boolean, boolean, boolean];
  cullFace: WebGL2Face;
  zNear: number;
  zFar: number;
  frontFace: WebGL2FrontFace;
  scissor: [number, number, number, number];
  capabilities: Record<WebGL2Capability, boolean>;
  blendFunc: WebGL2BlendFuncs;
  blendEquations: WebGL2BlendEquations;
  stencilTests: WebGL2StencilTests;
  stencilMasks: WebGL2StencilMasks;
  stencilOps: WebGL2StencilOps;
  depthFunc: WebGL2ComparisonFunc;
  depthMask: boolean;
}
