
class Logger {
    constructor() { }

    Log = new Map()
    CONSOLE_EL = <HTMLElement>document.getElementById('console')

    log(name, value) {
        this.Log.set(name, value)
    }

    time(name, time) {
        this.Log.set(name + ' ms', Math.round(time))
        if (time > 100) console.log(name + ' : ' + time)
    }

    printLogToConsole() {
        const LOG_EL = this.CONSOLE_EL.getElementsByClassName('log').item(0)
        if (!LOG_EL) return
        LOG_EL.innerHTML = ''
        for (let keyVal of this.Log) {
            let value = keyVal[1]
            if (!value) continue

            const labelNode = document.createElement('div')
            const keyNode = document.createElement('span')
            const valueNode = document.createElement('span')

            keyNode.innerHTML = keyVal[0].toString()
            valueNode.innerHTML = value.toString()

            labelNode.append(keyNode, valueNode)
            labelNode.className = 'entry'
            LOG_EL.append(labelNode)

        }
    }
}

class Timeline {
    TIMES = new Map()
    START_TIME = window.performance.now()
    PREVIOUS_TIME = window.performance.now()
    END_TIME: number | undefined
    RUN_DURATION: number = 0
    LOG_TO_CONSOLE_THRESHOLD: number

    constructor(public NAME: string) {

    }

    mark(LABEL: string) {
        this.TIMES.set(LABEL, Math.round(100 * (window.performance.now() - this.PREVIOUS_TIME)) / 100)
        this.RUN_DURATION += window.performance.now() - this.PREVIOUS_TIME
        this.PREVIOUS_TIME = window.performance.now()
    }

    get(LABEL: string) {
        const TIME = this.TIMES.get(LABEL)
        return TIME !== null ? TIME : 'null'
    }

    setLogThereshold(LIMIT: number) {
        this.LOG_TO_CONSOLE_THRESHOLD = LIMIT
    }

    end(PRINT = false) {
        this.END_TIME = Math.round(100 * window.performance.now()) / 100
        this.RUN_DURATION = this.END_TIME - this.START_TIME
        this.TIMES.set('TOTAL', this.RUN_DURATION)

        if (PRINT) {
            console.table(this.TIMES)
        } else {
            if (this.LOG_TO_CONSOLE_THRESHOLD && this.RUN_DURATION > this.LOG_TO_CONSOLE_THRESHOLD) {
                console.table(this.TIMES)
            }
        }
    }
}

function hexToRGB(hex: string) {
    if (hex[0] === '#') hex = hex.slice(1)
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return [r, g, b];
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return [h, s, l];
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [r * 255, g * 255, b * 255];
}

function randomRGB() {
    return [
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255)
    ]
}

function setTimeoutPromise(ms): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), ms)
    })
}

const LOGGER = new Logger()
export { LOGGER, Timeline, hexToRGB, rgbToHex, rgbToHsl, hslToRgb, randomRGB, setTimeoutPromise }