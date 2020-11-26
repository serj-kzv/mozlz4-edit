const uInt8sToUInt32sFn = uInt8s => {
    const uInt32s = [];

    for (let i = 0; i + 3 < uInt8s.length; i += 4) {
        uInt32s.push([uInt8s[i + 3] << 24 | uInt8s[i + 2] << 16 | uInt8s[i + 1] << 8 | uInt8s[i]]);
    }

    return new Uint32Array(uInt32s);
};

export default uInt8sToUInt32sFn;
