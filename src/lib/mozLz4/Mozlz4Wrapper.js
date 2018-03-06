class Mozlz4Wrapper {
    constructor() {
        this.LZ4_HEADER = [24, 77, 34, 4];
        this.MOZLZ4_MAGIC_HEADER = [109, 111, 122, 76, 122, 52, 48, 0];
        this.DECOMP_SIZE = [0, 133, 103, 0];
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

        file = Buffer.from(file);

        let uncompressedFile = new Buffer(file.length * 255); // TODO: replace by proper formula
        let uncompressedSize = LZ4.decodeBlock(file, uncompressedFile);

        uncompressedFile = new Uint8Array(uncompressedFile.buffer.slice(0, uncompressedSize));

        return uncompressedFile;
    }

    decodeMozLz4(file) {
        const mozHeader = this.getMozFileHeader(file);
        const decompSize = this.getMozFileDecompSize(file);

        file = this.getMozFileBody(file);
        file = this.decode(file);

        return {
            file,
            mozHeader,
            decompSize
        }
    }

    getMozFileHeader(file) {
        return file.slice(0, this.MOZLZ4_MAGIC_HEADER.length);
    }

    getMozFileDecompSize(file) {
        return file.slice(this.MOZLZ4_MAGIC_HEADER.length, this.MOZLZ4_MAGIC_HEADER.length + this.DECOMP_SIZE.length);
    }

    getMozFileBody(file) {
        return file.slice(this.MOZLZ4_MAGIC_HEADER.length + this.DECOMP_SIZE.length);
    }

    encode(data) {
        const Buffer = require('buffer').Buffer;
        const LZ4 = require('lz4');
        let input = new Buffer(data);
        let output = new Buffer(LZ4.encodeBound(input.length));
        let compressedSize = LZ4.encodeBlock(input, output);

        return new Uint8Array(output.buffer.slice(0, compressedSize));
    }

    encodeMozLz4(data) {
        let lz4 = this.encode(data);

        return this.addMozlz4Header(lz4);
    }

    convertMozLz4ToLz4(file) {
        let result = this.decode(file);

        result.file = this.encode(result.file);

        return result;
    }
}
