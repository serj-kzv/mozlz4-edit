import readFileAsFn from "./readFileAsFn";

const readFileAsBase64Fn = file => readFileAsFn(file, 'readAsDataURL');

export default readFileAsBase64Fn;
