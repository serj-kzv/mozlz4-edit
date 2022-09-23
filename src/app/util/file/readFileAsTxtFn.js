import readFileAsFn from "./readFileAsFn";

const readFileAsTxtFn = file => readFileAsFn(file, 'readAsText');

export default readFileAsTxtFn;
