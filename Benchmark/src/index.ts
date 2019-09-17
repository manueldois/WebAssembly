import './styles.scss'
import { Timeline } from './util'

console.log("STARTING RAINBOW BENCHMARK")



const DOM_ELEMENTS = gatherDOMElements()
const CANVASES = setupCanvases()

main()
function main() {
  attachEventListeners()
  let ROTATION_ANGLE = 0
  setInterval(() => {
    const TIMELINE = new Timeline('Render color wheel')

    makeColorWheelJS(CANVASES.JS_RENDERING.IMG_DATA, ROTATION_ANGLE)
    TIMELINE.mark('Make color wheel IMG_DATA JS')
    CANVASES.JS_RENDERING.CTX.putImageData(CANVASES.JS_RENDERING.IMG_DATA, 0, 0)
    DOM_ELEMENTS.JS_RENDERING.UI_EXEC_TIME.innerHTML = `${Math.round(TIMELINE.get('Make color wheel IMG_DATA JS'))} ms`

    ROTATION_ANGLE += 1 / (180 / Math.PI)
  }, 100)
}

/** Draws a color wheel in IMG_DATA  */
function makeColorWheelJS(IMG_DATA: ImageData, OFFSET_ANGLE: number) {
  const WIDTH = IMG_DATA.width, HEIGHT = IMG_DATA.height
  const IMG_DATA_DATA = IMG_DATA.data
  const PI = Math.PI

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const INDEX = y * WIDTH * 4 + x * 4
      const ANGLE_TO_CENTER = Math.atan2((x - WIDTH / 2), (y - HEIGHT / 2)) // 0 to 2pi
      let HUE = (OFFSET_ANGLE + ANGLE_TO_CENTER) / (2 * PI) // 0 to 2pi => 0 to 1
      if (HUE > 1) HUE = HUE % 1
      const COLOR_RGB = HSLtoRGB(HUE, 1, 0.5)
      IMG_DATA_DATA[INDEX] = COLOR_RGB[0]
      IMG_DATA_DATA[INDEX + 1] = COLOR_RGB[1]
      IMG_DATA_DATA[INDEX + 2] = COLOR_RGB[2]
      IMG_DATA_DATA[INDEX + 3] = 255
    }
  }
}




/** Converts HSLtoRGB array
 * H, S and L input range = 0 ÷ 1.0
 * R, G and B output range = 0 ÷ 255
 */
function HSLtoRGB(H, S, L) {
  let var_1, var_2, R = 0, B = 0, G = 0

  if (S == 0) {

    R = L * 255
    G = L * 255
    B = L * 255
  } else {
    if (L < 0.5) var_2 = L * (1 + S)
    else var_2 = (L + S) - (S * L)

    var_1 = 2 * L - var_2

    R = Math.floor(255 * hueToRGB(var_1, var_2, H + (1 / 3)))
    G = Math.floor(255 * hueToRGB(var_1, var_2, H))
    B = Math.floor(255 * hueToRGB(var_1, var_2, H - (1 / 3)))

    return [R, G, B]
  }

  function hueToRGB(v1, v2, vH) {
    if (vH < 0) vH += 1
    if (vH > 1) vH -= 1
    if ((6 * vH) < 1) return (v1 + (v2 - v1) * 6 * vH)
    if ((2 * vH) < 1) return (v2)
    if ((3 * vH) < 2) return (v1 + (v2 - v1) * ((2 / 3) - vH) * 6)
    return (v1)
  }
}

function attachEventListeners() {
  DOM_ELEMENTS.JS_RENDERING.BTN_REFRESH.addEventListener('click', () => makeColorWheelJS(CANVASES.JS_RENDERING.IMG_DATA, Math.random() * 2 * Math.PI))
}

function gatherDOMElements() {
  const DOM_SECTIONS = {
    JS_RENDERING: document.getElementById('section.js-rendering'),
    WASM_RENDERING: document.getElementById('section.wasm-rendering')
  }

  return {
    JS_RENDERING: {
      SECTION: DOM_SECTIONS.JS_RENDERING,
      BTN_REFRESH: DOM_SECTIONS.JS_RENDERING.getElementsByClassName('btn.refresh')[0],
      UI_EXEC_TIME: DOM_SECTIONS.JS_RENDERING.getElementsByClassName('code.exec-time')[0],
      CANVAS: DOM_SECTIONS.JS_RENDERING.getElementsByTagName('canvas')[0]
    },
    WASM_RENDERING: {
      SECTION: DOM_SECTIONS.WASM_RENDERING,
      BTN_REFRESH: DOM_SECTIONS.WASM_RENDERING.getElementsByClassName('btn.refresh')[0],
      UI_EXEC_TIME: DOM_SECTIONS.WASM_RENDERING.getElementsByClassName('code.exec-time')[0],
      CANVAS: DOM_SECTIONS.WASM_RENDERING.getElementsByTagName('canvas')[0]
    }
  }

}

function setupCanvases() {
  const JS_RENDERING_WIDTH = DOM_ELEMENTS.JS_RENDERING.CANVAS.width
  const JS_RENDERING_HEIGHT = DOM_ELEMENTS.JS_RENDERING.CANVAS.height
  const JS_RENDERING_CTX = DOM_ELEMENTS.JS_RENDERING.CANVAS.getContext('2d')
  JS_RENDERING_CTX.fillRect(0, 0, JS_RENDERING_WIDTH, JS_RENDERING_HEIGHT)
  const JS_RENDERING = {
    CANVAS_EL: DOM_ELEMENTS.JS_RENDERING.CANVAS,
    CTX: JS_RENDERING_CTX,
    IMG_DATA: JS_RENDERING_CTX.getImageData(0, 0, JS_RENDERING_WIDTH, JS_RENDERING_HEIGHT)
  }



  const WASM_RENDERING_WIDTH = DOM_ELEMENTS.WASM_RENDERING.CANVAS.width
  const WASM_RENDERING_HEIGHT = DOM_ELEMENTS.WASM_RENDERING.CANVAS.height
  const WASM_RENDERING_CTX = DOM_ELEMENTS.WASM_RENDERING.CANVAS.getContext('2d')
  WASM_RENDERING_CTX.fillRect(0, 0, WASM_RENDERING_WIDTH, WASM_RENDERING_HEIGHT)
  const WASM_RENDERING = {
    CANVAS_EL: DOM_ELEMENTS.WASM_RENDERING.CANVAS,
    CTX: WASM_RENDERING_CTX,
    IMG_DATA: WASM_RENDERING_CTX.getImageData(0, 0, WASM_RENDERING_WIDTH, WASM_RENDERING_HEIGHT)
  }

  return { JS_RENDERING, WASM_RENDERING }
}

async function wasmBrowserInstantiate(wasmModuleUrl, importObject) {
  let response = undefined;

  if (!importObject) {
    importObject = {
      env: {
        abort: () => console.log("Abort!")
      }
    };
  }

  const fetchAndInstantiateTask = async () => {
    const wasmArrayBuffer = await fetch(wasmModuleUrl).then(response =>
      response.arrayBuffer()
    );
    return WebAssembly.instantiate(wasmArrayBuffer, importObject);
  };
  response = await fetchAndInstantiateTask();

  return response;
};