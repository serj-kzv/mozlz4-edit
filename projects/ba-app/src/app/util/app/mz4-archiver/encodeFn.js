import LZ4 from './../../../../assets/lib/lz4';

const encodeFn = file => {
    const Buffer = LZ4('buffer').Buffer;
    let input = new Buffer(file);
    const bufferSize = input.length;
    const lz4 = LZ4('lz4');
    let output = new Buffer(lz4.encodeBound(bufferSize));
    let compressedSize = lz4.encodeBlock(input, output);

    return {output, compressedSize, bufferSize};
};

export default encodeFn;
