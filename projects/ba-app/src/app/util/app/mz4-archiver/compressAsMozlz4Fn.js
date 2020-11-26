import MozLz4ArchiverCommandMozLz4 from "./command/MozLz4ArchiverCommandMozLz4";
import compressFn from "./compressFn";

const compressAsMozLz4Fn = file => compressFn(file, new MozLz4ArchiverCommandMozLz4());

export default compressAsMozLz4Fn;
