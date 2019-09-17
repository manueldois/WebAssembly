export const wasmBrowserInstantiate = async (wasmModuleUrl, importObject) => {
    let response = undefined;

    if (!importObject) {
        importObject = {
            env: {
                abort: () => console.log("Abort!")
            }
        };
    }

    // Fallback to using fetch to download the entire module
    // And then instantiate the module
    const fetchAndInstantiateTask = async () => {
        const wasmArrayBuffer = await fetch(wasmModuleUrl).then(response =>
            response.arrayBuffer()
        );
        return WebAssembly.instantiate(wasmArrayBuffer, importObject);
    };
    response = await fetchAndInstantiateTask();

    return response;
};


const runWasmAdd = async () => {
    // Instantiate our wasm module
    const wasmModule = await wasmBrowserInstantiate("./hello-world.wasm");

    // Call the Add function export from wasm, save the result
    const addResult = wasmModule.instance.exports.add(24, 24);

    // Set the result onto the body
    document.body.textContent = `Hello World! addResult: ${addResult}`;
};
runWasmAdd();