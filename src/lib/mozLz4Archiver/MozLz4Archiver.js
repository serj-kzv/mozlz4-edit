class MozLz4Archiver {
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

    static isEqual(file1, file2) {
        return file1.length === file2.length ? !file1.some((byte, index) => byte !== file2[index]) : false;
    }

    static unshiftUint8ArrayToFile(file, uInt8Array) {
        const output = new Uint8Array(uInt8Array.length + file.length);

        output.set(uInt8Array);
        output.set(file, uInt8Array.length);

        return output;
    }

    static decompress(file, commands = [
        new MozLz4ArchiverCommandMozLz4(),
        new MozLz4ArchiverCommandMozJSSLz4(),
        new MozLz4ArchiverCommandLz4(),
    ]) {
        for (let i = 0; i < commands.length; i++) {
            const decoder = new MozLz4ArchiverImpl(file, commands[i]);

            if (decoder.isThisType()) {
                return decoder.decode();
            }
        }

        return {
            file,
            header: '',
            decompressSize: ''
        };
    }

    static compress(file, command = new MozLz4ArchiverCommandLz4()) {
        return new MozLz4ArchiverImpl(file, command).encode();
    }

    getHeader() {
        throw new Error('This method has to be implemented!');
    }

    addDecompressSize() {
        throw new Error('This method has to be implemented!');
    }

    addHeader() {
        throw new Error('This method has to be implemented!');
    }

    getDecompressSize() {
        throw new Error('This method has to be implemented!');
    }

    getBody() {
        throw new Error('This method has to be implemented!');
    }

    isThisType() {
        throw new Error('This method has to be implemented!');
    }
}
