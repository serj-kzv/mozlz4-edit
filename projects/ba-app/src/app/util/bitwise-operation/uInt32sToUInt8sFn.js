const uInt32sToUInt8sFn = uInt32s => new Uint8Array([uInt32s, uInt32s >> 8, uInt32s >> 16, uInt32s >> 24]);

export default uInt32sToUInt8sFn;
