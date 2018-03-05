class Mozlz4Wrapper {
    constructor() {
        this.MOZLZ4_MAGIC_HEADER = [109, 111, 122, 76, 122, 52, 48, 0];
        this.DECOMP_SIZE = [0, 133, 103, 0];
        this.MOZLZ4_MAGIC_HEADER_SIZE = 8;
        this.MOZLZ4_MAGIC_DECOMP_SIZE_SIZE = 4;
    }

    getMagicHeader() {
        let magicHeaderWithBound = [];

        magicHeaderWithBound.push(...this.MOZLZ4_MAGIC_HEADER);
        magicHeaderWithBound.push(...this.DECOMP_SIZE);

        return Uint8Array.from(magicHeaderWithBound);
    }

    addMozlz4Header(lz4File) {
        const mozHeader = this.getMagicHeader();
        const mozOutput = new Uint8Array(mozHeader.length + lz4File.length);

        mozOutput.set(mozHeader);
        mozOutput.set(lz4File, mozHeader.length);

        return mozOutput;
    }

    decode(file) {
        let Buffer = require('buffer').Buffer;
        let LZ4 = require('lz4');

        const mozHeader = this.getMozFileHeader(file);
        const decompSize = this.getMozFileDecompSize(file);

        file = this.getMozFileBody(file);
        file = Buffer.from(file);

        let uncompressedFile = new Buffer(file.length * 255); // TODO: replace by proper formula
        let uncompressedSize = LZ4.decodeBlock(file, uncompressedFile);

        uncompressedFile = new Uint8Array(uncompressedFile.buffer.slice(0, uncompressedSize));

        return {
            file: uncompressedFile,
            mozHeader,
            decompSize
        };
    }

    getMozFileHeader(file) {
        return file.slice(0, this.MOZLZ4_MAGIC_HEADER_SIZE);
    }

    getMozFileDecompSize(file) {
        return file.slice(this.MOZLZ4_MAGIC_HEADER_SIZE, this.MOZLZ4_MAGIC_HEADER_SIZE + this.MOZLZ4_MAGIC_DECOMP_SIZE_SIZE);
    }

    getMozFileBody(file) {
        return file.slice(this.MOZLZ4_MAGIC_HEADER_SIZE + this.MOZLZ4_MAGIC_DECOMP_SIZE_SIZE);
    }

    async encode(data) {
        const Buffer = require('buffer').Buffer;
        const LZ4 = require('lz4');
        let input = new Buffer(data);
        let output = new Buffer(LZ4.encodeBound(input.length));
        let compressedSize = LZ4.encodeBlock(input, output);

        output = new Uint8Array(output.buffer.slice(0, compressedSize));
        output = this.addMozlz4Header(output);

        return output;
    }
}
