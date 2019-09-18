// The entry file of your WebAssembly module.
memory.grow(1);

function getPixelRGB(X: i32, Y: i32, WIDTH: i32, DATA_POINTER: i32): u32 {
  const PIXEL_INDEX = Y * WIDTH * 4 + X * 4
  const R = load<u8>(DATA_POINTER + PIXEL_INDEX + 0)
  const G = load<u8>(DATA_POINTER + PIXEL_INDEX + 1)
  const B = load<u8>(DATA_POINTER + PIXEL_INDEX + 2)
  const A = load<u8>(DATA_POINTER + PIXEL_INDEX + 3)
  return (<u32>R << 16) + (<u32>G << 8) + (<u32>B)
}

function setPixelRGB(X: i32, Y: i32, WIDTH: i32, DATA_POINTER: i32, RGB: u32): void {
  const PIXEL_INDEX = Y * WIDTH * 4 + X * 4
  const R = (RGB >> 16)
  const G = (RGB - (R << 16)) >> 8
  const B = (RGB - (R << 16) - (G << 8))

  store<u8>(DATA_POINTER + PIXEL_INDEX + 0, R)
  store<u8>(DATA_POINTER + PIXEL_INDEX + 1, G)
  store<u8>(DATA_POINTER + PIXEL_INDEX + 2, B)
  store<u8>(DATA_POINTER + PIXEL_INDEX + 3, 255)
}

/**
 * 
 * @param R Red as u8
 * @param G Green as u8
 * @param B Blue as u8
 * @returns HSL as u32. H, S, L range (0, 255). H is left shifted 16bits, S 8bits, and L 0bits
 */
function rgbToHsl(RGB: u32): u32 {
  const R = (RGB >> 16)
  const G = (RGB - (R << 16)) >> 8
  const B = (RGB - (R << 16) - (G << 8))

  let R_f32 = (<f32>R) / 255
  let G_f32 = (<f32>G) / 255
  let B_f32 = (<f32>B) / 255;

  let max_GB = <f32>Math.max(G_f32, B_f32)
  let max = <f32>Math.max(max_GB, R_f32)
  let min_GB = <f32>Math.min(G_f32, B_f32)
  let min = <f32>Math.min(min_GB, R_f32)

  let H: f32 = 0, S: f32 = 0, L: f32 = (max + min) / 2;

  if (max === min) {
    H = S = 0; // achromatic
  } else {
    var d = max - min;
    S = L > 0.5 ? d / (2 - max - min) : d / (max + min);

    if (max === R_f32) {
      H = (G_f32 - B_f32) / d + (G_f32 < B_f32 ? 6 : 0)
    } else {
      if (max === G_f32) {
        H = (B_f32 - R_f32) / d + 2
      } else {
        if (max === B_f32) {
          H = (R_f32 - G_f32) / d + 4;
        }
      }
    }

    H = H / 6;
  }

  return <u32>((<u32>(H * 255) << 16) + (<u32>(S * 255) << 8) + <u32>(L * 255))
}

export { getPixelRGB, setPixelRGB, rgbToHsl }

export function sortImgData(DATA_POINTER: i32, IMG_SIZE: i32): void {
  const WIDTH: i32 = IMG_SIZE
  const HEIGHT: i32 = IMG_SIZE
  let didChanges: u8 = 0

  do {
    didChanges = 0
    for (let y: i32 = 0; y < HEIGHT; y++) {
      for (let x: i32 = 0; x < WIDTH; x++) {
        const PIXEL_B = getPixelRGB(x + 1, y, WIDTH, DATA_POINTER)
        const PIXEL_A = getPixelRGB(x, y, WIDTH, DATA_POINTER)
          
          const PIXEL_B_HUE = rgbToHsl(PIXEL_B) >> 16
          const PIXEL_A_HUE = rgbToHsl(PIXEL_A) >> 16

        if (PIXEL_B_HUE > PIXEL_A_HUE) {
          setPixelRGB(x, y, WIDTH, DATA_POINTER, PIXEL_B)
          setPixelRGB(x + 1, y, WIDTH, DATA_POINTER, PIXEL_A)
          didChanges = 1
        }
      }
    }
  } while (didChanges === 1);

}