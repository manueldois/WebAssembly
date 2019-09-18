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
    const wasmModule = await wasmBrowserInstantiate('./index.wasm')

    // Get our exports object, with all of our exported Wasm Properties
    const wasmExports = wasmModule.instance.exports;

    const wasmMemory = wasmExports.memory

    // Create a Uint8Array to give us access to Wasm Memory
    const wasmByteMemoryArray = new Uint8Array(wasmMemory.buffer);

    console.log(wasmByteMemoryArray[0]); // Should Log "24".
    
    wasmByteMemoryArray[1] = 39
    const memory_index_1 = wasmModule.instance.exports.readWasmMemoryAndReturnIndexOne()
    console.log(memory_index_1)
}
main()