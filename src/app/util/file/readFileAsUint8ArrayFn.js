import readFileAsArrayBufferFn from "./readFileAsArrayBufferFn";

const readFileAsUint8ArrayFn = async file => new Uint8Array(await readFileAsArrayBufferFn(file));

export default readFileAsUint8ArrayFn;
