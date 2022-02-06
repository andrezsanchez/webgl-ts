import {
  WebGL2Face,
  WebGL2State,
  WebGL2FrontFace,
  WebGL2Capability,
  WebGL2BlendFunc,
  WebGL2BlendEquation,
  WebGL2ComparisonFunc,
  WebGL2StencilOp,
  WebGL2ErrorType,
  WebGL2VertexArray,
  WebGL2Program,
  WebGL2VertexAttribute,
  GL_MAX_VERTEX_ATTRIBS,
  WebGL2DataType,
  WebGL2ArrayBuffer,
  WebGL2ArrayBufferTarget,
  WebGL2BufferUsage,
  GLsize,
  WebGL2Parameter,
} from './WebGL2State';

function createDefaultWebGL2State(): WebGL2State {
  const defaultVertexArray = {
    pointers: new Map(),
    elementBuffer: null,
  };

  const viewport: [number, number, number, number] = [0, 0, 0, 0];
  return {
    defaultVertexArray,
    vertexArray: defaultVertexArray,
    arrayBuffer: null,

    vertexAttributes: new Map(),

    bufferSet: new Set(),
    vertexArraySet: new Set([defaultVertexArray]),

    error: null,

    blendColor: [0, 0, 0, 0],

    clearColor: [0, 0, 0, 0],
    clearDepth: 1,
    clearStencil: 0,

    polygonOffsetFactor: 0,
    polygonOffsetUnits: 0,

    // TODO: adjust to size of canvas
    viewport,

    colorMask: [true, true, true, true],

    cullFace: WebGL2Face.BACK,

    zNear: 0,
    zFar: 1,

    frontFace: WebGL2FrontFace.CCW,

    scissor: [0, 0, viewport[2], viewport[3]],

    capabilities: {
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
    },

    blendFunc: {
      sFactorRGB: WebGL2BlendFunc.ONE,
      sFactorA: WebGL2BlendFunc.ONE,
      dFactorRGB: WebGL2BlendFunc.ZERO,
      dFactorA: WebGL2BlendFunc.ZERO,
    },

    blendEquations: {
      modeRGB: WebGL2BlendEquation.FUNC_ADD,
      modeA: WebGL2BlendEquation.FUNC_ADD,
    },

    stencilTests: {
      front: {
        func: WebGL2ComparisonFunc.ALWAYS,
        ref: 0,
        mask: 1,
      },
      back: {
        func: WebGL2ComparisonFunc.ALWAYS,
        ref: 0,
        mask: 0b11111111111111111111111111111111,
      },
    },

    stencilMasks: {
      front: 0b11111111111111111111111111111111,
      back: 0b11111111111111111111111111111111,
    },

    stencilOps: {
      front: {
        fail: WebGL2StencilOp.KEEP,
        zfail: WebGL2StencilOp.KEEP,
        zpass: WebGL2StencilOp.KEEP,
      },
      back: {
        fail: WebGL2StencilOp.KEEP,
        zfail: WebGL2StencilOp.KEEP,
        zpass: WebGL2StencilOp.KEEP,
      },
    },

    depthFunc: WebGL2ComparisonFunc.LESS,

    depthMask: true,
  };
}

class WebGL2 {
  state = createDefaultWebGL2State();
  canvas: Uint8ClampedArray;

  constructor(width: number, height: number) {
    this.canvas = new Uint8ClampedArray(width * height * 4);
  }

  blendFunc(sFactor: WebGL2BlendFunc, dFactor: WebGL2BlendFunc) {
    const sourceIsConstantColor = ((sFactor === WebGL2BlendFunc.CONSTANT_COLOR) || (sFactor === WebGL2BlendFunc.ONE_MINUS_CONSTANT_COLOR));
    const destIsConstantColor = ((dFactor === WebGL2BlendFunc.CONSTANT_COLOR) || (dFactor === WebGL2BlendFunc.ONE_MINUS_CONSTANT_COLOR));
    const sourceIsConstantAlpha = ((sFactor === WebGL2BlendFunc.CONSTANT_ALPHA) || (sFactor === WebGL2BlendFunc.ONE_MINUS_CONSTANT_ALPHA));
    const destIsConstantAlpha = ((dFactor === WebGL2BlendFunc.CONSTANT_ALPHA) || (dFactor === WebGL2BlendFunc.ONE_MINUS_CONSTANT_ALPHA));

    if ((sourceIsConstantColor && destIsConstantAlpha) || (sourceIsConstantAlpha && destIsConstantColor)) {
      this.setError(WebGL2ErrorType.INVALID_OPERATION, "Cannot use constant color with a constant alpha together");
      return;
    }

    this.state.blendFunc = {
      sFactorRGB: sFactor,
      sFactorA: sFactor,
      dFactorRGB: dFactor,
      dFactorA: dFactor,
    };
  }

  blendFuncSeparate(
    sFactorRGB: WebGL2BlendFunc,
    sFactorA: WebGL2BlendFunc,
    dFactorRGB: WebGL2BlendFunc,
    dFactorA: WebGL2BlendFunc,
  ) {
    const sourceIsConstantColor = ((sFactorRGB === WebGL2BlendFunc.CONSTANT_COLOR) || (sFactorRGB === WebGL2BlendFunc.ONE_MINUS_CONSTANT_COLOR));
    const destIsConstantColor = ((dFactorRGB === WebGL2BlendFunc.CONSTANT_COLOR) || (dFactorRGB === WebGL2BlendFunc.ONE_MINUS_CONSTANT_COLOR));
    const sourceIsConstantAlpha = ((sFactorRGB === WebGL2BlendFunc.CONSTANT_ALPHA) || (sFactorRGB === WebGL2BlendFunc.ONE_MINUS_CONSTANT_ALPHA));
    const destIsConstantAlpha = ((dFactorRGB === WebGL2BlendFunc.CONSTANT_ALPHA) || (dFactorRGB === WebGL2BlendFunc.ONE_MINUS_CONSTANT_ALPHA));

    if ((sourceIsConstantColor && destIsConstantAlpha) || (sourceIsConstantAlpha && destIsConstantColor)) {
      this.setError(WebGL2ErrorType.INVALID_OPERATION, "Cannot use constant color with a constant alpha together");
      return;
    }

    this.state.blendFunc = {
      sFactorRGB,
      sFactorA,
      dFactorRGB,
      dFactorA,
    };
  }

  blendEquation(mode: WebGL2BlendEquation) {
    this.state.blendEquations = {
      modeRGB: mode,
      modeA: mode,
    };
  }

  blendEquationSeparate(
    modeRGB: WebGL2BlendEquation,
    modeA: WebGL2BlendEquation,
  ) {
    this.state.blendEquations = {
      modeRGB,
      modeA,
    };
  }

  stencilFunc(
    func: WebGL2ComparisonFunc,
    ref: number,
    mask: number,
  ) {
    this.state.stencilTests.front = {
      func,
      ref,
      mask,
    };
    this.state.stencilTests.back = {
      func,
      ref,
      mask,
    };
  }

  stencilFuncSeparate(
    face: WebGL2Face,
    func: WebGL2ComparisonFunc,
    ref: number,
    mask: number,
  ) {
    const front = (face === WebGL2Face.FRONT) || (face === WebGL2Face.FRONT_AND_BACK);
    const back = (face === WebGL2Face.BACK) || (face === WebGL2Face.FRONT_AND_BACK);

    if (front) {
      this.state.stencilTests.front = {
        func,
        ref,
        mask,
      };
    }

    if (back) {
      this.state.stencilTests.back = {
        func,
        ref,
        mask,
      };
    }
  }

  stencilMask(mask: number) {
    this.state.stencilMasks.front = mask;
    this.state.stencilMasks.back = mask;
  }

  stencilMaskSeparate(
    face: WebGL2Face,
    mask: number,
  ) {
    const front = (face === WebGL2Face.FRONT) || (face === WebGL2Face.FRONT_AND_BACK);
    const back = (face === WebGL2Face.BACK) || (face === WebGL2Face.FRONT_AND_BACK);

    if (front) {
      this.state.stencilMasks.front = mask;
    }

    if (back) {
      this.state.stencilMasks.back = mask;
    }
  }


  stencilOp(
    fail: WebGL2StencilOp,
    zfail: WebGL2StencilOp,
    zpass: WebGL2StencilOp,
  ) {
    this.state.stencilOps.front = {
      fail,
      zfail,
      zpass,
    };
    this.state.stencilOps.back = {
      fail,
      zfail,
      zpass,
    };
  }

  stencilOpSeparate(
    face: WebGL2Face,
    fail: WebGL2StencilOp,
    zfail: WebGL2StencilOp,
    zpass: WebGL2StencilOp,
  ) {
    const front = (face === WebGL2Face.FRONT) || (face === WebGL2Face.FRONT_AND_BACK);
    const back = (face === WebGL2Face.BACK) || (face === WebGL2Face.FRONT_AND_BACK);

    if (front) {
      this.state.stencilOps.front = {
        fail,
        zfail,
        zpass,
      };
    }

    if (back) {
      this.state.stencilOps.back = {
        fail,
        zfail,
        zpass,
      };
    }
  }

  // TODO: Implement the following methods:
  // activeTexture
  // attachShader
  // bindAttribLocation
  // bindFramebuffer
  // bindRenderbuffer
  // bindTexture
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
  // deleteFramebuffer
  // deleteShader
  // deleteTexture
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
  // texImage2D
  // texParameter[fi]
  // texSubImage2D
  // uniform[1234][fi][v]
  // uniformMatrix[234]fv
  // useProgram
  // validateProgram


  createVertexArray(): WebGL2VertexArray {
    return {
      pointers: new Map(),
      elementBuffer: null,
    };
  }

  depthFunc(func: WebGL2ComparisonFunc) {
    this.state.depthFunc = func;
  }

  depthMask(mask: boolean) {
    this.state.depthMask = mask;
  }

  // Stub method
  getAttribLocation(program: WebGL2Program, attributeName: string): number {
    return 0;
  }

  bindVertexArray(vertexArray: WebGL2VertexArray | null) {
    if (vertexArray === null) {
      this.state.vertexArray = this.state.defaultVertexArray;
      return;
    }
  
    if (!this.state.vertexArraySet.has(vertexArray)) {
      // ERROR?
      return;
    }

    this.state.vertexArray = vertexArray;
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
    const vertexAttribute = this.state.vertexArray.pointers.get(index) ?? this.createVertexAttribute(index);
    this.state.vertexArray.pointers.set(index, vertexAttribute);

    return vertexAttribute;
  }

  private setVertexAttribArrayEnabled(attributeLocation: number, enabled: boolean) {
    if (!this.state.vertexArray) {
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
    this.state.error = { type, message };
  }

  private clearError() {
    this.state.error = null;
  }

  getError(): WebGL2ErrorType {
    return this.state.error?.type ?? WebGL2ErrorType.NO_ERROR;
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
    // if (!this.state.vertexArray) {
    //   this.setError(WebGL2ErrorType.GL_INVALID_OPERATION, "No vertex array object is bound");
    //   return;
    // }

    const buffer = this.state.arrayBuffer;
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
    const buffer: WebGL2ArrayBuffer = {
      data: new Uint8Array(),
      usage: WebGL2BufferUsage.STATIC_DRAW,
      size: 0,
    };
    this.state.bufferSet.add(buffer);

    return buffer;
  }

  bindBuffer(target: WebGL2ArrayBufferTarget, buffer: WebGL2ArrayBuffer | undefined) {
    if (buffer && !this.state.bufferSet.has(buffer)) {
      this.setError(WebGL2ErrorType.INVALID_VALUE, "Not a valid buffer object");
      return;
    }

    if (!(target as unknown) || !(target in WebGL2ArrayBufferTarget)) {
      this.setError(WebGL2ErrorType.INVALID_ENUM, "Not a valid buffer target");
      return;
    }

    switch (target) {
      case WebGL2ArrayBufferTarget.ELEMENT_ARRAY_BUFFER: {
        this.state.vertexArray.elementBuffer = buffer ?? null;
        break;
      }
      case WebGL2ArrayBufferTarget.ARRAY_BUFFER: {
        this.state.arrayBuffer = buffer ?? null;
        break;
      }
    }
  }

  deleteBuffer(buffer: WebGL2ArrayBuffer) {
    if (!this.state.bufferSet.has(buffer)) {
      this.setError(WebGL2ErrorType.INVALID_OPERATION, 'Cannot delete a buffer from another context');
      return;
    }

    this.state.bufferSet.delete(buffer);

    // TODO: Figure out what to do about this being used in other objects.
  }

  isBuffer(value: unknown): value is WebGL2ArrayBuffer {
    return this.state.bufferSet.has(value as WebGL2ArrayBuffer);
  }

  private getBufferForTarget(target: WebGL2ArrayBufferTarget): WebGL2ArrayBuffer | null {
    switch (target) {
      case WebGL2ArrayBufferTarget.ARRAY_BUFFER: return this.state.arrayBuffer;
      case WebGL2ArrayBufferTarget.ELEMENT_ARRAY_BUFFER: return this.state.vertexArray.elementBuffer;
      default: return null;
    }
  }

  bufferData(
    target: WebGL2ArrayBufferTarget,
    size: number,
    usage: WebGL2BufferUsage,
  ): undefined;

  bufferData(
    target: WebGL2ArrayBufferTarget,
    srcData: ArrayBuffer | ArrayBufferView,
    usage: WebGL2BufferUsage,
  ): undefined;

  bufferData(
    target: WebGL2ArrayBufferTarget,
    srcData: ArrayBuffer | ArrayBufferView,
    usage: WebGL2BufferUsage,
    srcOffset: number,
    length?: number,
  ): undefined;

  bufferData(
    target: WebGL2ArrayBufferTarget,
    bufferOrSize: ArrayBuffer | ArrayBufferView | number,
    usage: WebGL2BufferUsage,
    srcOffset?: number,
    length?: number,
  ) {
    const buffer = this.getBufferForTarget(target);
    if (!buffer) {
      this.setError(WebGL2ErrorType.INVALID_OPERATION, 'No buffer is bound to the target');
      return;
    }

    if (srcOffset === undefined) {
      if (typeof bufferOrSize === 'number') {
        this.setError(WebGL2ErrorType.INVALID_VALUE, 'Invalid buffer value');
        return;
      }
    }

    if (bufferOrSize instanceof ArrayBuffer) {
      buffer.data = new Uint8Array(bufferOrSize);
      buffer.size = buffer.data.length;
    } else if (typeof bufferOrSize === 'number') {
      buffer.data = new Uint8Array(bufferOrSize);
      buffer.size = bufferOrSize;
    } else {
      const srcOffsetWithDefault = (typeof srcOffset === 'number') ? srcOffset : 0;
      const totalOffset = srcOffsetWithDefault + bufferOrSize.byteOffset;
      const size = length ?? 0;
      if ((totalOffset + size) > (bufferOrSize.byteOffset + bufferOrSize.byteLength)) {
        this.setError(WebGL2ErrorType.INVALID_OPERATION, 'Size and offset specified exceeds bounds of source buffer');
        return;
      }

      buffer.data = new Uint8Array(bufferOrSize.buffer, totalOffset, size);
    }

    buffer.usage = usage;
  }

  bufferSubData(
    target: WebGL2ArrayBufferTarget,
    offset: number,
    srcData: ArrayBuffer | ArrayBufferView | null,
  ): undefined;
  bufferSubData(
    target: WebGL2ArrayBufferTarget,
    dstByteOffset: number,
    srcData: ArrayBuffer | ArrayBufferView | null,
    srcOffset: number,
    length: number,
  ): undefined;

  bufferSubData(
    target: WebGL2ArrayBufferTarget,
    offset: number,
    srcData: ArrayBuffer | ArrayBufferView | null,
    srcOffset: number = 0,
    length?: number,
  ) {
    const arrayBuffer = this.getBufferForTarget(target);
    if (!arrayBuffer) {
      this.setError(WebGL2ErrorType.INVALID_ENUM, 'Invalid target');
      return;
    }

    if (!srcData) {
      this.setError(WebGL2ErrorType.INVALID_VALUE, 'null cannot be used for buffer data');
      return;
    }

    const size = length ?? 0;
    if (srcData instanceof ArrayBuffer) {
      const totalOffset = srcOffset + srcData.byteLength;
      const end = totalOffset + size;
      if (end > arrayBuffer.size) {
        this.setError(WebGL2ErrorType.INVALID_OPERATION, 'Size and offset specified exceeds bounds of source buffer');
        return;
      }

      const srcBuffer = new Uint8Array(srcData);
      for (let i = offset; i < end; i += 1) {
        arrayBuffer.data[i] = srcBuffer[i];
      }
    }
  }

  vertexAttrib1f(attributeLocation: number, x: number) {
    this.state.vertexAttributes.set(attributeLocation, new Float32Array([x]));
  }

  vertexAttrib2f(attributeLocation: number, x: number, y: number) {
    this.state.vertexAttributes.set(attributeLocation, new Float32Array([x, y]));
  }

  vertexAttrib3f(attributeLocation: number, x: number, y: number, z: number) {
    this.state.vertexAttributes.set(attributeLocation, new Float32Array([x, y, z]));
  }

  vertexAttrib4f(attributeLocation: number, x: number, y: number, z: number, w: number) {
    this.state.vertexAttributes.set(attributeLocation, new Float32Array([x, y, z, w]));
  }

  vertexAttrib1fv(attributeLocation: number, list: Float32Array) {
    if (list.length < 1) {
      this.setError(WebGL2ErrorType.INVALID_VALUE, 'Array length must be at least 1');
      return;
    }

    // Clone the list.
    this.state.vertexAttributes.set(attributeLocation, new Float32Array(list));
  }

  vertexAttrib2fv(attributeLocation: number, list: Float32Array) {
    if (list.length < 2) {
      this.setError(WebGL2ErrorType.INVALID_VALUE, 'Array length must be at least 2');
      return;
    }

    // Clone the list.
    this.state.vertexAttributes.set(attributeLocation, new Float32Array(list));
  }

  vertexAttrib3fv(attributeLocation: number, list: Float32Array) {
    if (list.length < 3) {
      this.setError(WebGL2ErrorType.INVALID_VALUE, 'Array length must be at least 3');
      return;
    }

    // Clone the list.
    this.state.vertexAttributes.set(attributeLocation, new Float32Array(list));
  }

  vertexAttrib4fv(attributeLocation: number, list: Float32Array) {
    if (list.length < 4) {
      this.setError(WebGL2ErrorType.INVALID_VALUE, 'Array length must be at least 4');
      return;
    }

    // Clone the list.
    this.state.vertexAttributes.set(attributeLocation, new Float32Array(list));
  }

  blendColor(r: number, g: number, b: number, a: number) {
    // TODO: clamp
    this.state.blendColor = [r, g, b, a];
  }

  clearColor(r: number, g: number, b: number, a: number) {
    this.state.clearColor = [r, g, b, a];
  }

  clearDepth(depth: number) {
    this.state.clearDepth = depth;
  }

  clearStencil(stencil: number) {
    this.state.clearStencil = stencil;
  }

  lineWidth(width: number) {
    // Do nothing since we won't allow any width except 1.
  }

  polygonOffset(factor: number, units: number) {
    this.state.polygonOffsetFactor = factor;
    this.state.polygonOffsetUnits = units;
  }

  viewport(x: number, y: number, width: number, height: number) {
    // TODO: validate inputs
    this.state.viewport = [x, y, width, height];
  }

  colorMask(r: boolean, g: boolean, b: boolean, a: boolean) {
    this.state.colorMask = [r, g, b, a];
  }

  cullFace(mode: WebGL2Face) {
    this.state.cullFace = mode;
  }

  depthRange(zNear: number, zFar: number) {
    this.state.zNear = Math.min(Math.max(zNear, 0), 1);
    this.state.zFar = Math.min(Math.max(zFar, 0), 1);
  }

  frontFace(frontFace: WebGL2FrontFace) {
    this.state.frontFace = frontFace;
  }

  scissor(x: number, y: number, width: number, height: number) {
    this.state.scissor = [x, y, width, height];
  }

  getParameter(parameter: WebGL2Parameter.CULL_FACE): WebGL2Face;
  getParameter(parameter: WebGL2Parameter.DEPTH_FUNC): WebGL2ComparisonFunc;
  getParameter(parameter: WebGL2Parameter.DEPTH_RANGE): Float32Array;
  getParameter(parameter: WebGL2Parameter.VIEWPORT): Int32Array;
  getParameter(parameter: WebGL2Parameter.LINE_WIDTH): 1;
  getParameter(parameter: WebGL2Parameter.ALIASED_LINE_WIDTH_RANGE): Float32Array;

  getParameter(parameter: WebGL2Parameter) {
    switch (parameter) {
      case WebGL2Parameter.BLEND_SRC_RGB:
        return this.state.blendFunc.sFactorRGB;
      case WebGL2Parameter.BLEND_SRC_ALPHA:
        return this.state.blendFunc.sFactorA;
      case WebGL2Parameter.BLEND_DEST_RGB:
        return this.state.blendFunc.dFactorRGB;
      case WebGL2Parameter.BLEND_DEST_ALPHA:
        return this.state.blendFunc.dFactorA;
      case WebGL2Parameter.CULL_FACE:
        return this.state.cullFace;
      case WebGL2Parameter.DEPTH_FUNC:
        return this.state.depthFunc;
      case WebGL2Parameter.DEPTH_MASK:
        return this.state.depthMask;
      case WebGL2Parameter.DEPTH_RANGE:
        return new Float32Array([this.state.zNear, this.state.zFar]);
      case WebGL2Parameter.LINE_WIDTH:
        return 1;
      case WebGL2Parameter.ALIASED_LINE_WIDTH_RANGE:
        return new Float32Array([1, 1]);
      case WebGL2Parameter.VIEWPORT:
        return new Int32Array(this.state.viewport);
      case WebGL2Parameter.STENCIL_FUNC:
        return this.state.stencilTests.front.func;
      case WebGL2Parameter.STENCIL_REF:
        return this.state.stencilTests.front.ref;
      case WebGL2Parameter.STENCIL_VALUE_MASK:
        return this.state.stencilTests.front.mask;
      case WebGL2Parameter.STENCIL_BACK_FUNC:
        return this.state.stencilTests.back.func;
      case WebGL2Parameter.STENCIL_BACK_REF:
        return this.state.stencilTests.back.ref;
      case WebGL2Parameter.STENCIL_BACK_VALUE_MASK:
        return this.state.stencilTests.back.mask;
      case WebGL2Parameter.STENCIL_BITS:
        return 32;
      case WebGL2Parameter.STENCIL_WRITEMASK:
        return this.state.stencilMasks.front;
      case WebGL2Parameter.STENCIL_BACK_WRITEMASK:
        return this.state.stencilMasks.back;
      case WebGL2Parameter.STENCIL_FAIL:
        return this.state.stencilOps.front.fail;
      case WebGL2Parameter.STENCIL_PASS_DEPTH_PASS:
        return this.state.stencilOps.front.zpass;
      case WebGL2Parameter.STENCIL_PASS_DEPTH_FAIL:
        return this.state.stencilOps.front.zfail;
      case WebGL2Parameter.STENCIL_BACK_FAIL:
        return this.state.stencilOps.back.fail;
      case WebGL2Parameter.STENCIL_BACK_PASS_DEPTH_PASS:
        return this.state.stencilOps.back.zpass;
      case WebGL2Parameter.STENCIL_BACK_PASS_DEPTH_FAIL:
        return this.state.stencilOps.back.zfail;
    }
  }

  enable(capability: WebGL2Capability) {
    this.state.capabilities[capability] = true;
  }

  disable(capability: WebGL2Capability) {
    this.state.capabilities[capability] = false;
  }

  isEnabled(capability: WebGL2Capability): boolean {
    return this.state.capabilities[capability];
  }
}
