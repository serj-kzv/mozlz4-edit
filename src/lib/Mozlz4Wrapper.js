class Mozlz4Wrapper {
    constructor() {
        this.MOZLZ4_MAGIC_HEADER = [109, 111, 122, 76, 122, 52, 48, 0];
        this.DECOMP_SIZE = [0, 133, 103, 0];
        this.MOZLZ4_MAGIC_HEADER_SIZE = 12;
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
        const that = this;

        return new Promise(resolve => {
            const fileReader = new FileReader();

            fileReader.addEventListener('loadend', event => {
                let Buffer = require('buffer').Buffer;
                let LZ4 = require('lz4');

                let fileBlob = event.target.result;

                fileBlob = that.sliceMozlz4Header(fileBlob);

                let compressed = new Buffer(fileBlob);
                let uncompressed = new Buffer(compressed.length * 255); // TODO: replace by proper formula
                let uncompressedSize = LZ4.decodeBlock(compressed, uncompressed);

                uncompressed = new Uint8Array(uncompressed.buffer.slice(0, uncompressedSize));

                resolve(uncompressed);
            });
            fileReader.readAsArrayBuffer(file);
        });
    }

    sliceMozlz4Header(fileBlob) {
        const slicedFile = fileBlob.slice(this.MOZLZ4_MAGIC_HEADER_SIZE);

        return slicedFile;
    }

    encode(data) {
        const that = this;

        return new Promise(resolve => {
            const Buffer = require('buffer').Buffer;
            const LZ4 = require('lz4');
            let input = new Buffer(data);
            let output = new Buffer(LZ4.encodeBound(input.length));
            let compressedSize = LZ4.encodeBlock(input, output);

            output = new Uint8Array(output.buffer.slice(0, compressedSize));
            output = that.addMozlz4Header(output);

            resolve(output);
        });
    }
}
