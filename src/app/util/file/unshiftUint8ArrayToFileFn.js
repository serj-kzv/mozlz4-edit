const unshiftUint8ArrayToFileFn = (file, uInt8Array) => {
    const output = new Uint8Array(uInt8Array.length + file.length);

    output.set(uInt8Array);
    output.set(file, uInt8Array.length);

    return output;
}

export default unshiftUint8ArrayToFileFn;
