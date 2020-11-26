import uInt8sToUInt32sFn from "../../bitwise-operation/uInt8sToUInt32sFn";
import isEqualFn from "../../file/isEqualFn";
import readFileAsUint8ArrayFn from "../../file/readFileAsUint8ArrayFn";

const decodeFn = async (sourceFile, command) => {
    const sourceFileUint8Array = await readFileAsUint8ArrayFn(sourceFile);
    const {header: commandHeader} = command;
    const {length: commandHeaderLength} = commandHeader;
    const sourceFileUint8ArrayHeader = sourceFileUint8Array.slice(0, commandHeaderLength);

    if (isEqualFn(sourceFileUint8ArrayHeader, commandHeader)) {
        const fileHeadersLength = commandHeaderLength + command.decompressSize.length;
        const decompressSizeHeader = sourceFileUint8Array.slice(commandHeaderLength, fileHeadersLength);
        const decompressSize = uInt8sToUInt32sFn(decompressSizeHeader)[0];
        const body = sourceFileUint8Array.slice(fileHeadersLength);
        const Buffer = LZ4('buffer').Buffer;
        const file = Buffer.from(body);
        let uncompressedFile = new Buffer(decompressSize);
        const lz4 = LZ4('lz4');

        lz4.decodeBlock(file, uncompressedFile);
        uncompressedFile = new Uint8Array(uncompressedFile);

        return {file: uncompressedFile, command, decompressSize};
    }

    return undefined;
};

export default decodeFn;
