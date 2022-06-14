import Control from '../common/control';
import vertexShaderSource from '../shaders/vertexShader.c';
import fragmentShaderSource from '../shaders/fragmentShader.c';

export default class Application extends Control {
  constructor(parentNode: HTMLElement) {
    super(parentNode);
    const canvas = new Control<HTMLCanvasElement>(this.node, 'canvas');
    canvas.node.width = 500;
    canvas.node.height = 500;
    const gl = canvas.node.getContext("webgl");
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = createProgram(gl, vertexShader, fragmentShader);
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    var positions = [
      0, 0,
      0, 0.5,
      0.7, 0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
 
    // Указываем атрибуту, как получать данные от positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 компоненты на итерацию
    var type = gl.FLOAT;   // наши данные - 32-битные числа с плавающей точкой
    var normalize = false; // не нормализовать данные
    var stride = 0;        // 0 = перемещаться на size * sizeof(type) каждую итерацию для получения следующего положения
    var offset = 0;        // начинать с начала буфера
    gl.vertexAttribPointer(
      positionAttributeLocation, size, type, normalize, stride, offset);
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 3;
    gl.drawArrays(primitiveType, offset, count);
  }
}

function createShader(gl: WebGLRenderingContext, type:number, source:string) {
  var shader = gl.createShader(type);   // создание шейдера
  gl.shaderSource(shader, source);      // устанавливаем шейдеру его программный код
  gl.compileShader(shader);             // компилируем шейдер
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {                        // если компиляция прошла успешно - возвращаем шейдер
    return shader;
  }
 
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl:WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader:WebGLShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
 
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}