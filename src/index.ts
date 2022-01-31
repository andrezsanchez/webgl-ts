enum WebGL2ArrayBufferTarget {
  ARRAY_BUFFER,
  ELEMENT_ARRAY_BUFFER,
}

type GLsize = number;

enum WebGL2BufferUsage {
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

enum WebGL2ErrorType {
  NO_ERROR,
  INVALID_ENUM,
  INVALID_VALUE,
  INVALID_OPERATION,
}

interface WebGL2ArrayBufferContents {
  data: Uint8Array;
  elementSize: number;
  usage: WebGL2BufferUsage;
}

interface WebGL2ArrayBuffer {
  contents: WebGL2ArrayBufferContents | null;
}

interface WebGL2VertexArray {
  pointers: Map<number, WebGL2VertexAttribute>;
  elementBuffer: WebGL2ArrayBuffer | null;
}

interface WebGL2VertexAttributePointer {
  buffer: WebGL2ArrayBuffer;
  elementSize: number;
  offset: number;
  stride: number;
  normalized: boolean;
  type: WebGL2DataType;
}

interface WebGL2VertexAttribute {
  index: number;
  enabled: boolean;
  pointer: WebGL2VertexAttributePointer | null;
  // divisor?
}

interface WebGL2Program {
  code: string;
}

const GL_MAX_VERTEX_ATTRIBS = 1024;

interface WebGL2Error {
  type: WebGL2ErrorType;
  message: string;
}

enum WebGL2DataType {
  FLOAT,
}

enum WebGL2CullFace {
  FRONT,
  BACK,
  FRONT_AND_BACK,
}

enum WebGL2Capability {
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

enum WebGL2FrontFace {
  CW,
  CCW,
}

enum WebGL2Parameter {
  CULL_FACE,
  DEPTH_RANGE,
  LINE_WIDTH,
  ALIASED_LINE_WIDTH_RANGE,
  VIEWPORT,
}

class WebGL2 {
  defaultVertexArray: WebGL2VertexArray = {
    pointers: new Map(),
    elementBuffer: null,
  };

  // Bound objects
  vertexArray: WebGL2VertexArray = this.defaultVertexArray;
  arrayBuffer: WebGL2ArrayBuffer | null = null;

  // Global vertex attribute values
  vertexAttributes: Map<number, Float32Array> = new Map();

  bufferSet: Set<WebGL2ArrayBuffer> = new Set();
  vertexArraySet: Set<WebGL2VertexArray> = new Set([this.defaultVertexArray]);

  error: WebGL2Error | null = null;

  blendColor_: [number, number, number, number] = [0, 0, 0, 0];

  clearColor_: [number, number, number, number] = [0, 0, 0, 0];
  clearDepth_: number = 1;
  clearStencil_: number = 0;

  polygonOffsetFactor = 0;
  polygonOffsetUnits = 0;

  // TODO: adjust to size of canvas
  viewport_: [number, number, number, number] = [0, 0, 0, 0];

  colorMask_: [boolean, boolean, boolean, boolean] = [true, true, true, true];

  cullFace_ = WebGL2CullFace.BACK;

  zNear = 0;
  zFar = 1;

  frontFace_: WebGL2FrontFace = WebGL2FrontFace.CCW;

  scissor_: [number, number, number, number] = [0, 0, this.viewport_[2], this.viewport_[3]];

  capabilities: Record<WebGL2Capability, boolean> = {
    [WebGL2Capability.BLEND]: false,
    [WebGL2Capability.CULL_FACE]: false,
    [WebGL2Capability.DEPTH_TEST]: false,
    [WebGL2Capability.DITHER]: true,
    [WebGL2Capability.POLYGON_OFFSET_FILL]: false,
    [WebGL2Capability.SAMPLE_ALPHA_TO_COVERAGE]: false,
    [WebGL2Capability.SAMPLE_COVERAGE]: false,
    [WebGL2Capability.SCISSOR_TEST]: false,
    [WebGL2Capability.STENCIL_TEST]: false,
    [WebGL2Capability.RASTERIZER_DISCARD]: false,
  }

  // TODO: Implement the following methods:
  // activeTexture
  // attachShader
  // bindAttribLocation
  // bindFramebuffer
  // bindRenderbuffer
  // bindTexture
  // blendEquation
  // blendEquationSeparate
  // blendFunc
  // blendFuncSeparate
  // bufferSubData
  // checkFramebufferStatus
  // clear(mask: number)
  // commit
  // compileShader
  // compressedTexImage[23]D
  // compressedTexSubImage2D
  // copyTexImage2D()
  // copyTexSubImage2D()
  // createFramebuffer
  // createProgram
  // createRenderbuffer
  // createShader
  // createTexture
  // deleteBuffer
  // deleteFramebuffer
  // deleteShader
  // deleteTexture
  // depthFunc
  // depthMask
  // detachShader
  // drawArrays
  // drawElements
  // finish
  // flush
  // framebufferRenderbuffer
  // framebufferTexture2D
  // generateMipmap
  // getActiveAttrib
  // getActiveUniform
  // getAttachedShaders
  // getAttribLocation
  // getBufferParameter
  // getContextAttributes
  // getExtension
  // getFramebufferAttachmentParameter
  // getProgramInfoLog
  // getProgramParameter
  // getRenderbufferParameter
  // getShaderInfoLog
  // getShaderParameter
  // getShaderPrecisionFormat
  // getShaderSource
  // getSupportedExtensions
  // getTexParameter
  // getUniform
  // getUniformLocation
  // getVertexAttrib
  // getVertexAttribOffset
  // hint
  // isContextLost
  // isFramebuffer
  // isProgram
  // isRenderbuffer
  // isShader
  // isTexture
  // linkProgram
  // makeXRCompatible
  // pixelStorei
  // readPixels
  // renderbufferStorage
  // sampleCoverage
  // shaderSource
  // stencilFunc
  // stencilFuncSeparate
  // stencilMask
  // stencilMaskSeparate
  // stencilOp
  // stencilOpSeparate
  // texImage2D
  // texParameter[fi]
  // texSubImage2D
  // uniform[1234][fi][v]
  // uniformMatrix[234]fv
  // useProgram
  // validateProgram
  // vertexAttrib[1234]fv


  createVertexArray(): WebGL2VertexArray {
    return {
      pointers: new Map(),
      elementBuffer: null,
    };
  }

  // Stub method
  getAttribLocation(program: WebGL2Program, attributeName: string): number {
    return 0;
  }

  bindVertexArray(vertexArray: WebGL2VertexArray) {
    if (!this.vertexArraySet.has(vertexArray)) {
      // ERROR?
      return;
    }

    this.vertexArray = vertexArray;
  }

  private createVertexAttribute(index: number): WebGL2VertexAttribute {
    const vertexAttribute: WebGL2VertexAttribute = {
      index,
      enabled: false,
      pointer: null,
    };

    return vertexAttribute;
  }

  private createOrGetVertexAttribute(index: number): WebGL2VertexAttribute {
    const vertexAttribute = this.vertexArray.pointers.get(index) ?? this.createVertexAttribute(index);
    this.vertexArray.pointers.set(index, vertexAttribute);

    return vertexAttribute;
  }

  private setVertexAttribArrayEnabled(attributeLocation: number, enabled: boolean) {
    if (!this.vertexArray) {
      this.setError(WebGL2ErrorType.INVALID_OPERATION, "No vertex array object is bound");
      return;
    }

    const pointer = this.createOrGetVertexAttribute(attributeLocation);

    if (attributeLocation >= GL_MAX_VERTEX_ATTRIBS) {
      this.setError(WebGL2ErrorType.INVALID_VALUE, "Attribute location is greater than the maximum");
    }

    pointer.enabled = enabled;
  }

  private setError(type: WebGL2ErrorType, message: string) {
    this.error = { type, message };
  }

  private clearError() {
    this.error = null;
  }

  getError(): WebGL2ErrorType {
    return this.error?.type ?? WebGL2ErrorType.NO_ERROR;
  }

  enableVertexAttribArray(attributeLocation: number) {
    this.setVertexAttribArrayEnabled(attributeLocation, true);
  }
  disableVertexAttribArray(attributeLocation: number) {
    this.setVertexAttribArrayEnabled(attributeLocation, false);
  }

  vertexAttribPointer(
    attributeLocation: number,
    size: number,
    type: WebGL2DataType,
    normalized: boolean,
    stride: number,
    offset: number,
  ) {
    // Can target generic vertex attributes.
    // if (!this.vertexArray) {
    //   this.setError(WebGL2ErrorType.GL_INVALID_OPERATION, "No vertex array object is bound");
    //   return;
    // }

    const buffer = this.arrayBuffer;
    if (!buffer) {
      this.setError(WebGL2ErrorType.INVALID_OPERATION, "No ARRAY_BUFFER buffer is bound");
      return;
    }

    if (stride < 0) {
      this.setError(WebGL2ErrorType.INVALID_VALUE, "Stride cannot be negative");
      return;
    }
    // TODO: `type` error,
    // TODO: invalid `size` error if not 1, 2, 3, or 4

    const attribute = this.createOrGetVertexAttribute(attributeLocation);

    attribute.pointer = {
      elementSize: size,
      buffer,
      offset,
      stride,
      type,
      normalized,
    };
  }

  createBuffer(): WebGL2ArrayBuffer {
    const buffer: WebGL2ArrayBuffer = { contents: null };
    this.bufferSet.add(buffer);

    return buffer;
  }

  bindBuffer(target: WebGL2ArrayBufferTarget, buffer: WebGL2ArrayBuffer | undefined) {
    if (buffer && !this.bufferSet.has(buffer)) {
      this.setError(WebGL2ErrorType.INVALID_VALUE, "Not a valid buffer object");
      return;
    }

    if (!(target as unknown) || !(target in WebGL2ArrayBufferTarget)) {
      this.setError(WebGL2ErrorType.INVALID_ENUM, "Not a valid buffer target");
      return;
    }

    switch (target) {
      case WebGL2ArrayBufferTarget.ELEMENT_ARRAY_BUFFER: {
        this.vertexArray.elementBuffer = buffer ?? null;
        break;
      }
      case WebGL2ArrayBufferTarget.ARRAY_BUFFER: {
        this.arrayBuffer = buffer ?? null;
        break;
      }
    }
  }

  isBuffer(value: unknown): value is WebGL2ArrayBuffer {
    return this.bufferSet.has(value as WebGL2ArrayBuffer);
  }

  private getBufferForTarget(target: WebGL2ArrayBufferTarget): WebGL2ArrayBuffer | null {
    switch (target) {
      case WebGL2ArrayBufferTarget.ARRAY_BUFFER: return this.arrayBuffer;
      case WebGL2ArrayBufferTarget.ELEMENT_ARRAY_BUFFER: return this.vertexArray.elementBuffer;
      default: return null;
    }
  }

  bufferData(
    target: WebGL2ArrayBufferTarget,
    size: GLsize,
    data: Uint8Array,
    usage: WebGL2BufferUsage,
  ) {
    const buffer = this.getBufferForTarget(target);
    if (!buffer) {
      return;
    }

    // Blow away any contents already present.
    buffer.contents = {
      // Copy the data.
      data: new Uint8Array(data),
      elementSize: size,
      usage,
    };
  }

  vertexAttrib1f(attributeLocation: number, x: number) {
    this.vertexAttributes.set(attributeLocation, new Float32Array([x]));
  }

  vertexAttrib2f(attributeLocation: number, x: number, y: number) {
    this.vertexAttributes.set(attributeLocation, new Float32Array([x, y]));
  }

  vertexAttrib3f(attributeLocation: number, x: number, y: number, z: number) {
    this.vertexAttributes.set(attributeLocation, new Float32Array([x, y, z]));
  }

  vertexAttrib4f(attributeLocation: number, x: number, y: number, z: number, w: number) {
    this.vertexAttributes.set(attributeLocation, new Float32Array([x, y, z, w]));
  }

  blendColor(r: number, g: number, b: number, a: number) {
    // TODO: clamp
    this.blendColor_ = [r, g, b, a];
  }

  clearColor(r: number, g: number, b: number, a: number) {
    this.clearColor_ = [r, g, b, a];
  }

  clearDepth(depth: number) {
    this.clearDepth_ = depth;
  }

  clearStencil(stencil: number) {
    this.clearStencil_ = stencil;
  }

  lineWidth(width: number) {
    // Do nothing since we won't allow any width except 1.
  }

  polygonOffset(factor: number, units: number) {
    this.polygonOffsetFactor = factor;
    this.polygonOffsetUnits = units;
  }

  viewport(x: number, y: number, width: number, height: number) {
    // TODO: validate inputs
    this.viewport_ = [x, y, width, height];
  }

  colorMask(r: boolean, g: boolean, b: boolean, a: boolean) {
    this.colorMask_ = [r, g, b, a];
  }

  cullFace(mode: WebGL2CullFace) {
    this.cullFace_ = mode;
  }

  depthRange(zNear: number, zFar: number) {
    this.zNear = Math.min(Math.max(zNear, 0), 1);
    this.zFar = Math.min(Math.max(zFar, 0), 1);
  }

  frontFace(frontFace: WebGL2FrontFace) {
    this.frontFace_ = frontFace;
  }

  scissor(x: number, y: number, width: number, height: number) {
    this.scissor_ = [x, y, width, height];
  }

  getParameter(parameter: WebGL2Parameter.CULL_FACE): WebGL2CullFace;
  getParameter(parameter: WebGL2Parameter.DEPTH_RANGE): Float32Array;
  getParameter(parameter: WebGL2Parameter.VIEWPORT): Int32Array;
  getParameter(parameter: WebGL2Parameter.LINE_WIDTH): 1;
  getParameter(parameter: WebGL2Parameter.ALIASED_LINE_WIDTH_RANGE): Float32Array;

  getParameter(parameter: WebGL2Parameter) {
    switch (parameter) {
      case WebGL2Parameter.CULL_FACE:
        return this.cullFace_;
      case WebGL2Parameter.DEPTH_RANGE:
        return new Float32Array([this.zNear, this.zFar]);
      case WebGL2Parameter.LINE_WIDTH:
        return 1;
      case WebGL2Parameter.ALIASED_LINE_WIDTH_RANGE:
        return new Float32Array([1, 1]);
      case WebGL2Parameter.VIEWPORT:
        return new Int32Array(this.viewport_);
    }
  }

  enable(capability: WebGL2Capability) {
    this.capabilities[capability] = true;
  }

  disable(capability: WebGL2Capability) {
    this.capabilities[capability] = false;
  }

  isEnabled(capability: WebGL2Capability): boolean {
    return this.capabilities[capability];
  }
}
