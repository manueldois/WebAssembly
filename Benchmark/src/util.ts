
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
            console.log(this.NAME, this.TIMES)
        } else {
            if (this.LOG_TO_CONSOLE_THRESHOLD && this.RUN_DURATION > this.LOG_TO_CONSOLE_THRESHOLD) {
                console.log(this.NAME, this.TIMES)
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
export { LOGGER, Timeline, hexToRGB, rgbToHex, randomRGB, setTimeoutPromise }