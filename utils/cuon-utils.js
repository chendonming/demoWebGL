// cuon-utils.js (c) 2012 kanda and matsuda
/**
 * Create a program object and make current
 * @param gl GL context
 * @param vshader a vertex shader program (string)
 * @param fshader a fragment shader program (string)
 * @return true, if the program object was created and successfully made current
 */
function initShaders(gl, vshader, fshader) {
  var program = createProgram(gl, vshader, fshader);
  if (!program) {
    console.log('Failed to create program');
    return false;
  }

  gl.useProgram(program);
  gl.program = program;

  return true;
}

/**
 * Create the linked program object
 * @param gl GL context
 * @param vshader a vertex shader program (string)
 * @param fshader a fragment shader program (string)
 * @return created program object, or null if the creation has failed
 */
function createProgram(gl, vshader, fshader) {
  // Create shader object
  var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
  var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
  if (!vertexShader || !fragmentShader) {
    return null;
  }

  // Create a program object
  var program = gl.createProgram();
  if (!program) {
    return null;
  }

  // Attach the shader objects
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // Link the program object
  gl.linkProgram(program);

  // Check the result of linking
  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    var error = gl.getProgramInfoLog(program);
    console.log('Failed to link program: ' + error);
    gl.deleteProgram(program);
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);
    return null;
  }
  return program;
}

/**
 * Create a shader object
 * @param gl GL context
 * @param type the type of the shader object to be created
 * @param source shader program (string)
 * @return created shader object, or null if the creation has failed.
 */
function loadShader(gl, type, source) {
  // Create shader object
  var shader = gl.createShader(type);
  if (shader == null) {
    console.log('unable to create shader');
    return null;
  }

  // Set the shader program
  gl.shaderSource(shader, source);

  // Compile the shader
  gl.compileShader(shader);

  // Check the result of compilation
  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    var error = gl.getShaderInfoLog(shader);
    console.log('Failed to compile shader: ' + error);
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

/**
 * Initialize and get the rendering for WebGL
 * @param canvas <cavnas> element
 * @param opt_debug flag to initialize the context for debugging
 * @return the rendering context for WebGL
 */
function getWebGLContext(canvas, opt_debug) {
  // Get the rendering context for WebGL
  var gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) return null;

  // if opt_debug is explicitly false, create the context for debugging
  if (arguments.length < 2 || opt_debug) {
    gl = WebGLDebugUtils.makeDebugContext(gl);
  }

  return gl;
}

/**
 *
 * @param {*} gl webGL-context
 * @param {Float32Array} verties 缓冲区数据
 * @param {string} attribute 属性名
 * @param {number} size 一次性拿几个数据
 * @returns
 */
function initVertexBuffer(gl, verties, attribute = 'a_Position', size = 2, total = 2) {
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verties, gl.STATIC_DRAW);

  const a_Position = gl.getAttribLocation(gl.program, attribute);
  const FSIZE = verties.BYTES_PER_ELEMENT
  gl.vertexAttribPointer(a_Position, size, gl.FLOAT, false, size * FSIZE, 0);
  gl.enableVertexAttribArray(a_Position);
  return verties.length / total
}

function setVec4Attribute(gl, attribute, x = 0, y = 0, z = 0, w = 1) {
  var a_Position = gl.getAttribLocation(gl.program, attribute);
  gl.vertexAttrib4f(a_Position, x, y, z, w);
}

function clear(gl) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

/**
 * 画个正方形
 * @param gl webGL-Context
 * @param position 左上角位置
 * @param attribute
 * @param width 宽度
 * @param height 高度
 */
function drawSquare(gl, position, attribute, width, height) {
  const verties = new Float32Array([
    position.x, position.y,
    position.x + width, position.y,
    position.x + width, position.y - height,
    position.x, position.y - height
  ])
  const len = initVertexBuffer(gl, verties, attribute, 2, 2)
  gl.drawArrays(gl.TRIANGLE_FAN, 0, len)
}
