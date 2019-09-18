import './styles.scss'
import { Timeline, rgbToHsl, hslToRgb } from './util'
import * as seedrandom from 'seedrandom'
import { CanvasContext } from './interfaces';

console.log("STARTING RAINBOW SORTING BENCHMARK")

const IMG_SIZE = 100
const RANDOM_IMG_DATA = new ImageData(IMG_SIZE, IMG_SIZE) // Shared initial random image data
const DOM_ELEMENTS = gatherDOMElements()

let RND_SEED = 'hello'


main()
async function main() {
  const JS_CANVAS = setupJSCanvas()
  const WASM_CANVAS = setupWASMCanvas()

  const WASM_MODULE = await wasmBrowserInstantiate("./assembly/index.wasm");

  attachEventListeners()
  makeRndInitialImgData()
  resetCanvasJS(JS_CANVAS)
  resetCanvasWASM(WASM_CANVAS)

  function attachEventListeners() {
    DOM_ELEMENTS.CONTROLS.BTN_RANDOMIZE.addEventListener('click', () => {
      makeRndInitialImgData()
      resetCanvasJS(JS_CANVAS)
      resetCanvasWASM(WASM_CANVAS)
    })

    DOM_ELEMENTS.CONTROLS.IN_RND_SEED.addEventListener('change', (e) => {
      console.log('Got seed: ' + e.target.value)
      if (!e.target.value) {
        alert('Seed must exist')
        return
      }
      RND_SEED = e.target.value
    })

    DOM_ELEMENTS.JS.BTN_RESET.addEventListener('click', () => {
      resetCanvasJS(JS_CANVAS)
    })

    DOM_ELEMENTS.JS.BTN_SORT.addEventListener('click', () => {
      sortCanvasJS(JS_CANVAS)
    })

    DOM_ELEMENTS.WASM.BTN_RESET.addEventListener('click', () => {
      resetCanvasWASM(WASM_CANVAS)
    })

    DOM_ELEMENTS.WASM.BTN_SORT.addEventListener('click', () => {
      sortCanvasWASM(WASM_MODULE, WASM_CANVAS)
    })
  }
}

function makeRndInitialImgData() {
  const seededRnd = new seedrandom.alea(RND_SEED);

  const WIDTH = RANDOM_IMG_DATA.width, HEIGHT = RANDOM_IMG_DATA.height
  const RND_IMG_DATA_DATA = RANDOM_IMG_DATA.data

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const INDEX = y * WIDTH * 4 + x * 4
      const COLOR_RGB = hslToRgb(seededRnd(), 1, 0.5)

      RND_IMG_DATA_DATA[INDEX] = COLOR_RGB[0]
      RND_IMG_DATA_DATA[INDEX + 1] = COLOR_RGB[1]
      RND_IMG_DATA_DATA[INDEX + 2] = COLOR_RGB[2]
      RND_IMG_DATA_DATA[INDEX + 3] = 255
    }
  }
}


function resetCanvasJS(JS_CANVAS: CanvasContext) {
  const TIMELINE = new Timeline('Reset JS Canvas');

  JS_CANVAS.CTX.putImageData(RANDOM_IMG_DATA, 0, 0)
  TIMELINE.mark('Reset JS Canvas')
  TIMELINE.end()

  DOM_ELEMENTS.JS.UI_RENDER_TIME.innerHTML = `${Math.round(TIMELINE.RUN_DURATION)} ms`
}

function sortCanvasJS(JS_CANVAS: CanvasContext) {
  const TIMELINE = new Timeline('Sort JS Canvas');
  console.log("Sorting JS Canvas...")

  const IMG_DATA = JS_CANVAS.CTX.getImageData(0, 0, IMG_SIZE, IMG_SIZE)

  if(IMG_DATA.width === 0 || IMG_DATA.height === 0){
    throw new Error('Failed to get IMAGE DATA. Try running demo hosted on your machine')
  } 

  sortImgDataJS(IMG_DATA)
  TIMELINE.mark('Sort JS Canvas')
  
  JS_CANVAS.CTX.putImageData(IMG_DATA, 0, 0)
  TIMELINE.mark('Render image')
  TIMELINE.end()

  DOM_ELEMENTS.JS.UI_SORT_TIME.innerHTML = `${Math.round(TIMELINE.RUN_DURATION)} ms`
  DOM_ELEMENTS.JS.UI_RENDER_TIME.innerHTML = `${Math.round(TIMELINE.get('Render image'))} ms`


  /** Sorts and Mutates IMG_DATA */
  function sortImgDataJS(IMG_DATA: ImageData) {
    const WIDTH = IMG_DATA.width, HEIGHT = IMG_DATA.height
    const IMG_DATA_DATA = IMG_DATA.data

    let didChanges = false

    do {
      didChanges = false
      for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
          const PIXEL_A = getPixelRGB(x, y)
          const PIXEL_B = getPixelRGB(x + 1, y) // x may be larger than width but the index will be correct

          if (PIXEL_A && PIXEL_B) {
            const PIXEL_A_HUE = rgbToHsl(PIXEL_A[0], PIXEL_A[1], PIXEL_A[2])[0]
            const PIXEL_B_HUE = rgbToHsl(PIXEL_B[0], PIXEL_B[1], PIXEL_B[2])[0]

            if (PIXEL_B_HUE > PIXEL_A_HUE) {
              setPixelRGB(x, y, PIXEL_B)
              setPixelRGB(x + 1, y, PIXEL_A)
              didChanges = true
            }
          }
        }
      }
    } while (didChanges);

    function getPixelRGB(X: number, Y: number) {
      const PIXEL_INDEX = Y * WIDTH * 4 + X * 4
      if (PIXEL_INDEX > IMG_DATA_DATA.length - 1) return null
      return [
        IMG_DATA_DATA[PIXEL_INDEX + 0],
        IMG_DATA_DATA[PIXEL_INDEX + 1],
        IMG_DATA_DATA[PIXEL_INDEX + 2],
      ]
    }

    function setPixelRGB(X: number, Y: number, RGB: number[]) {
      const PIXEL_INDEX = Y * WIDTH * 4 + X * 4
      if (PIXEL_INDEX > IMG_DATA_DATA.length - 1) return null
      IMG_DATA_DATA[PIXEL_INDEX + 0] = RGB[0]
      IMG_DATA_DATA[PIXEL_INDEX + 1] = RGB[1]
      IMG_DATA_DATA[PIXEL_INDEX + 2] = RGB[2]
      IMG_DATA_DATA[PIXEL_INDEX + 3] = 255
    }

  }

}

function resetCanvasWASM(WASM_CANVAS: CanvasContext) {
  const TIMELINE = new Timeline('Reset WASM Canvas');

  WASM_CANVAS.CTX.putImageData(RANDOM_IMG_DATA, 0, 0)
  TIMELINE.mark('Reset WASM Canvas')
  TIMELINE.end()

  DOM_ELEMENTS.JS.UI_RENDER_TIME.innerHTML = `${Math.round(TIMELINE.RUN_DURATION)} ms`
}

function sortCanvasWASM(WASM_MODULE: WebAssembly.WebAssemblyInstantiatedSource, WASM_CANVAS: CanvasContext) {
  const TIMELINE = new Timeline('Reset WASM Canvas');
  console.log("Sorting WASM Canvas...")


  const IMG_DATA = WASM_CANVAS.CTX.getImageData(0, 0, IMG_SIZE, IMG_SIZE)
  const IMG_DATA_LENGTH = IMG_SIZE * IMG_SIZE * 4

  // Alocate memory and store a pointer to it
  const WASM_IMG_DATA_POINTER = WASM_MODULE.instance.exports.__alloc(IMG_DATA_LENGTH + 1)
  const WASM_IMG_DATA = new Uint8ClampedArray(WASM_MODULE.instance.exports.memory.buffer, WASM_IMG_DATA_POINTER, IMG_DATA_LENGTH)
  TIMELINE.mark('Allocate memory in wasm')

  // Transfer the IMG_DATA from JS to WASM
  WASM_IMG_DATA.set(IMG_DATA.data)
  TIMELINE.mark('Transfer image to wasm')

  // Sort IMG_DATA within WASM
  WASM_MODULE.instance.exports.sortImgData(WASM_IMG_DATA_POINTER, IMG_SIZE)
  TIMELINE.mark('Sort image inside wasm')

  // Transfer the data back to JS
  const NEW_IMG_DATA = new ImageData(WASM_IMG_DATA, IMG_SIZE, IMG_SIZE)
  TIMELINE.mark('Transfer the sorted image back to js')


  WASM_CANVAS.CTX.putImageData(NEW_IMG_DATA, 0, 0)
  TIMELINE.mark('Render image')
  TIMELINE.end(true)

  DOM_ELEMENTS.WASM.UI_SORT_TIME.innerHTML = `${Math.round(TIMELINE.RUN_DURATION)} ms`
  DOM_ELEMENTS.WASM.UI_RENDER_TIME.innerHTML = `${Math.round(TIMELINE.get('Render image'))} ms`

}




function gatherDOMElements() {
  const DOM_SECTIONS = {
    JS: document.getElementById('section-js-rendering'),
    WASM: document.getElementById('section-wasm-rendering'),
    CONTROLS: document.getElementById('section-controls'),
  }

  return {
    JS: {
      SECTION: DOM_SECTIONS.JS,
      BTN_RESET: DOM_SECTIONS.JS.getElementsByClassName('btn-reset')[0],
      BTN_SORT: DOM_SECTIONS.JS.getElementsByClassName('btn-sort')[0],
      UI_RENDER_TIME: DOM_SECTIONS.JS.getElementsByClassName('code-render-time')[0],
      UI_SORT_TIME: DOM_SECTIONS.JS.getElementsByClassName('code-sort-time')[0],
      CANVAS: DOM_SECTIONS.JS.getElementsByTagName('canvas')[0],
    },
    WASM: {
      SECTION: DOM_SECTIONS.WASM,
      BTN_RESET: DOM_SECTIONS.WASM.getElementsByClassName('btn-reset')[0],
      BTN_SORT: DOM_SECTIONS.WASM.getElementsByClassName('btn-sort')[0],
      UI_RENDER_TIME: DOM_SECTIONS.WASM.getElementsByClassName('code-render-time')[0],
      UI_SORT_TIME: DOM_SECTIONS.WASM.getElementsByClassName('code-sort-time')[0],
      CANVAS: DOM_SECTIONS.WASM.getElementsByTagName('canvas')[0],
    },
    CONTROLS: {
      IN_RND_SEED: DOM_SECTIONS.CONTROLS.getElementsByClassName('in-random-seed')[0],
      BTN_RANDOMIZE: DOM_SECTIONS.CONTROLS.getElementsByClassName('btn-randomize')[0],
    }
  }

}

function setupJSCanvas() {
  const JS_CTX = DOM_ELEMENTS.JS.CANVAS.getContext('2d')
  DOM_ELEMENTS.JS.CANVAS.width = IMG_SIZE
  DOM_ELEMENTS.JS.CANVAS.height = IMG_SIZE
  DOM_ELEMENTS.JS.CANVAS.style.transform = `scale(${500 / IMG_SIZE})`
  JS_CTX.fillRect(0, 0, IMG_SIZE, IMG_SIZE)

  const JS_CANVAS: CanvasContext = {
    CANVAS: DOM_ELEMENTS.JS.CANVAS,
    CTX: JS_CTX,
  }

  return JS_CANVAS
}

function setupWASMCanvas() {
  const WASM_CTX = DOM_ELEMENTS.WASM.CANVAS.getContext('2d')
  DOM_ELEMENTS.WASM.CANVAS.width = IMG_SIZE
  DOM_ELEMENTS.WASM.CANVAS.height = IMG_SIZE
  DOM_ELEMENTS.WASM.CANVAS.style.transform = `scale(${500 / IMG_SIZE})`
  WASM_CTX.fillRect(0, 0, IMG_SIZE, IMG_SIZE)

  const WASM_CANVAS: CanvasContext = {
    CANVAS: DOM_ELEMENTS.WASM.CANVAS,
    CTX: WASM_CTX,
  }

  return WASM_CANVAS
}

async function wasmBrowserInstantiate(wasmModuleUrl, importObject?) {
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
}