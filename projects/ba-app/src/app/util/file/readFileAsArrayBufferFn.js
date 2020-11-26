import readFileAsFn from "./readFileAsFn";

const readFileAsArrayBufferFn = file => readFileAsFn(file, 'readAsArrayBuffer');

export default readFileAsArrayBufferFn;
