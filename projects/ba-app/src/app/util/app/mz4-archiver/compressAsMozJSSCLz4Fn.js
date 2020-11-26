import MozLz4ArchiverCommandMozJSSLz4 from "./command/MozLz4ArchiverCommandMozJSSLz4";
import compressFn from "./compressFn";

const compressAsMozJSSCLz4Fn = file => compressFn(file, new MozLz4ArchiverCommandMozJSSLz4());

export default compressAsMozJSSCLz4Fn;
