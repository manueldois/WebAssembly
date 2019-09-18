// The entry file of your WebAssembly module.
memory.grow(1);

@inline
function getPixelRGB(X: i32, Y: i32, WIDTH: i32, DATA_POINTER: i32): u32 {
  const PIXEL_INDEX = (Y * WIDTH + X) << 2
  return load<u32>(DATA_POINTER + PIXEL_INDEX);
}

@inline
function setPixelRGB(X: i32, Y: i32, WIDTH: i32, DATA_POINTER: i32, RGBA: u32): void {
  const PIXEL_INDEX = (Y * WIDTH + X) << 2
  store<u32>(DATA_POINTER + PIXEL_INDEX, RGBA)
}

/**
 *
 * @param R Red as u8
 * @param G Green as u8
 * @param B Blue as u8
 * @returns HSL as u32. H, S, L range (0, 255). H is left shifted 16bits, S 8bits, and L 0bits
 */
function rgbToHsl(RGB: u32): u32 {
  const R = RGB & 0xFF;
  const G = (RGB >> 8) & 0xFF;
  const B = (RGB >> 16) & 0xFF;

  let R_f32 = (<f32>R) * (1.0 / 255)
  let G_f32 = (<f32>G) * (1.0 / 255)
  let B_f32 = (<f32>B) * (1.0 / 255)

  let max = Mathf.max(Mathf.max(G_f32, B_f32), R_f32)
  let min = Mathf.min(Mathf.min(G_f32, B_f32), R_f32)

  let H: f32 = 0, S: f32 = 0, L: f32 = (max + min) * 0.5;

  if (max == min) {
    H = S = 0; // achromatic
  } else {
    var d = max - min;
    S = L > 0.5 ? d / (2 - max - min) : d / (max + min);
    d = 1 / d;

    if (max === R_f32) {
      H = (G_f32 - B_f32) * d + (G_f32 < B_f32 ? 6 : 0)
    } else {
      if (max === G_f32) {
        H = (B_f32 - R_f32) * d + 2
      } else {
        if (max === B_f32) {
          H = (R_f32 - G_f32) * d + 4;
        }
      }
    }

    H *= 1.0 / 6.0;
  }

  return (<u32>(H * 255) << 16) | (<u32>(S * 255) << 8) | <u32>(L * 255)
}

export { getPixelRGB, setPixelRGB, rgbToHsl }

export function sortImgData(DATA_POINTER: i32, IMG_SIZE: i32): void {
  const WIDTH = IMG_SIZE
  const HEIGHT = IMG_SIZE
  let didChanges = false

  do {
    didChanges = false
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        const PIXEL_B = getPixelRGB(x + 1, y, WIDTH, DATA_POINTER)
        const PIXEL_A = getPixelRGB(x, y, WIDTH, DATA_POINTER)
        const PIXEL_B_HUE = rgbToHsl(PIXEL_B) >> 16
        const PIXEL_A_HUE = rgbToHsl(PIXEL_A) >> 16

        if (PIXEL_B_HUE > PIXEL_A_HUE) {
          setPixelRGB(x, y, WIDTH, DATA_POINTER, PIXEL_B)
          setPixelRGB(x + 1, y, WIDTH, DATA_POINTER, PIXEL_A)
          didChanges = true
        }
      }
    }
  } while (didChanges);
}
