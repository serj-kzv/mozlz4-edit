class MozLz4Archiver {
    constructor() {
        this.HEADER = null;
        this.DECOMPRESS_SIZE = null;
    }

    static unshiftUint8ArrayToFile(file, uInt8Array) {
        const output = new Uint8Array(uInt8Array.length + file.length);

        output.set(uInt8Array);
        output.set(file, uInt8Array.length);

        return output;
    }

    decode(file) {
        let Buffer = require('buffer').Buffer;
        let LZ4 = require('lz4');

        file = Buffer.from(file);

        let uncompressedFile = new Buffer(file.length * 255); // TODO: replace by proper formula
        let uncompressedSize = LZ4.decodeBlock(file, uncompressedFile);

        uncompressedFile = new Uint8Array(uncompressedFile.buffer.slice(0, uncompressedSize));

        return uncompressedFile;
    }

    encode(data) {
        const Buffer = require('buffer').Buffer;
        const LZ4 = require('lz4');
        let input = new Buffer(data);
        let output = new Buffer(LZ4.encodeBound(input.length));
        let compressedSize = LZ4.encodeBlock(input, output);

        return new Uint8Array(output.buffer.slice(0, compressedSize));
    }

    isThisType(file) {
        return this.isEqual(this.getHeader(file), this.HEADER);
    }

    static isEqual(file1, file2) {
        return file1.length === file2.length ? !file1.some((byte, index) => byte !== file2[index]) : false;
    }

    getHeader(file) {
        throw new Error('This method has to be implemented!');
    }

    addDecompressSize(file) {
        throw new Error('This method has to be implemented!');
    }

    addHeader(file) {
        throw new Error('This method has to be implemented!');
    }

    getDecompressSize(file) {
        throw new Error('This method has to be implemented!');
    }

    getBody(file) {
        throw new Error('This method has to be implemented!');
    }
}
