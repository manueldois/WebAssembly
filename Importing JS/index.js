export const wasmBrowserInstantiate = async (wasmModuleUrl, importObject) => {
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

async function main() {
    const wasmModule = await wasmBrowserInstantiate('./index.wasm', {
        index: {
            consoleLog: value => console.log(value)
        },
        env: {
            abort: () => console.log("Abort!")
        }
    })
}
main()