class Mozlz4Wrapper {
    constructor() {
        this.MOZLZ4_MAGIC_HEADER = [109, 111, 122, 76, 122, 52, 48, 0];
        this.DECOMP_SIZE = [0, 133, 103, 0];
        this.MOZLZ4_MAGIC_HEADER_SIZE = 12;
    }

    getMagicHeader() {
        const magicHeaderWithBound = [];

        magicHeaderWithBound
            .push(...this.MOZLZ4_MAGIC_HEADER)
            .push(...this.DECOMP_SIZE);

        return Uint8Array.from(magicHeaderWithBound);
    }

    addMozlz4Header(lz4File) {
        const mozHeader = this.getMagicHeader();
        const mozOutput = new Uint8Array(mozHeader.length + lz4File.length);

        mozOutput.set(mozHeader);
        mozOutput.set(lz4File, mozHeader.length);

        return mozOutput;
    }

    async decode(file) {
        const that = this;

        return new Promise(resolve => new FileReader()
            .addEventListener('loadend', event => {
                const Buffer = require('buffer').Buffer;
                const LZ4 = require('lz4');

                let output = that.sliceMozlz4Header(new Buffer(event.target.result));
                let uncompressed = new Buffer(output.length * 255); // TODO: replace by proper formula
                const uncompressedSize = LZ4.decodeBlock(output, uncompressed);

                uncompressed = uncompressed.slice(0, uncompressedSize);

                resolve(uncompressed);
            }));
    }

    sliceMozlz4Header(file) {
        return file.slice(this.MOZLZ4_MAGIC_HEADER_SIZE);
    }

    async encode(data) {
        const that = this;

        return new Promise(resolve => {
            const Buffer = require('buffer').Buffer;
            const LZ4 = require('lz4');

            let input = new Buffer(data);
            let output = new Buffer(LZ4.encodeBound(input.length));
            let compressedSize = LZ4.encodeBlock(input, output);

            output = output.slice(0, compressedSize);
            output = that.addMozlz4Header(output);

            resolve(output);
        });
    }
}
