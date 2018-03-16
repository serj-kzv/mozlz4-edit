class Mozlz4Archiver {
    constructor() {
        // standard lz4 header (first bytes)
        this.LZ4_HEADER = Uint8Array.from([24, 77, 34, 4]);

        // [109, 111, 122, 76, 122, 52, 48, 0] is default Mozilla's magic header
        // A text representation of this header is "mozLz40\0" (without quotes)
        this.MOZLZ4_MAGIC_HEADER = Uint8Array.from([109, 111, 122, 76, 122, 52, 48, 0]);

        // [254, 254, 254, 127] is max decopressed file size
        // TODO: it's temporary value, replace this with DECOMP_SIZE computing
        this.DECOMP_SIZE = Uint8Array.from([254, 254, 254, 127]);
    }

    static unshiftUint8ArrayToFile(file, uInt8Array) {
        const output = new Uint8Array(uInt8Array.length + file.length);

        output.set(uInt8Array);
        output.set(file, uInt8Array.length);

        return output;
    }

    addMozlz4Header(lz4File) {
        return Mozlz4Archiver.unshiftUint8ArrayToFile(lz4File, this.MOZLZ4_MAGIC_HEADER);
    }

    addDecompSize(lz4File) {
        return Mozlz4Archiver.unshiftUint8ArrayToFile(lz4File, this.DECOMP_SIZE);
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

        lz4 = this.addDecompSize(lz4);

        return this.addMozlz4Header(lz4);
    }

    convertMozLz4ToLz4(file) {
        let result = this.decodeMozLz4(file);

        result.file = this.encode(result.file);

        return result;
    }

    isMozLz4File(file) {
        return Mozlz4Archiver.isEqual(this.getMozFileHeader(file), this.MOZLZ4_MAGIC_HEADER);
    }

    static isEqual(file1, file2) {
        return file1.length === file2.length ? !file1.some((byte, index) => byte !== file2[index]) : false;
    }
}
