import uInt32sToUInt8sFn from "../../bitwise-operation/uInt32sToUInt8sFn.js";
import unshiftUint8ArrayToFileFn from "../../file/unshiftUint8ArrayToFileFn.js";
import encodeFn from "./encodeFn";

const compressFn = (sourceFile, command) => {
    const {output, compressedSize, bufferSize} = encodeFn(sourceFile);
    let file = new Uint8Array(output.buffer.slice(0, compressedSize));
    const decompressedSizeHeader = uInt32sToUInt8sFn(bufferSize);

    file = unshiftUint8ArrayToFileFn(file, decompressedSizeHeader);

    return unshiftUint8ArrayToFileFn(file, command.header);
};

export default compressFn;
