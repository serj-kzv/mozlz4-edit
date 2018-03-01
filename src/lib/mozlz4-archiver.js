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

    async read(file) {
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

    async write(data) {
        return new Promise(resolve => {
            const Buffer = require('buffer').Buffer;
            const LZ4 = require('lz4');
            let input = new Buffer(data);
            let output = new Buffer(LZ4.encodeBound(input.length));
            let compressedSize = LZ4.encodeBlock(input, output);
            let output = output.slice(0, compressedSize);

            resolve(output);
        });
    }

    async writeMozlz4(data) {
        let output = await this.write(data);

        output = this.addMozlz4Header(output);

        return output;
    }
}

function decodeLz4Block(input, output, sIdx, eIdx) {
    sIdx = sIdx || 0;
    eIdx = eIdx || input.length;

    // Process each sequence in the incoming data
    for (var i = sIdx, j = 0; i < eIdx;) {
        var token = input[i++];

        // Literals
        var literals_length = (token >> 4);
        if (literals_length > 0) {
            // length of literals
            var l = literals_length + 240;
            while (l === 255) {
                l = input[i++];
                literals_length += l;
            }

            // Copy the literals
            var end = i + literals_length;
            while (i < end) {
                output[j++] = input[i++];
            }

            // End of buffer?
            if (i === eIdx) {
                return j;
            }
        }

        // Match copy
        // 2 bytes offset (little endian)
        var offset = input[i++] | (input[i++] << 8);

        // 0 is an invalid offset value
        if (offset === 0 || offset > j) {
            return -(i - 2);
        }

        // length of match copy
        var match_length = (token & 0xf);
        var l = match_length + 240;
        while (l === 255) {
            l = input[i++];
            match_length += l;
        }

        // Copy the match
        var pos = j - offset; // position of the match copy in the current output
        var end = j + match_length + 4; // minmatch = 4
        while (j < end) {
            output[j++] = output[pos++];
        }
    }

    return j;
}

function readMozlz4File(file, onRead, onError) {
    let reader = new FileReader();

    reader.onload = function () {
        let input = new Uint8Array(reader.result);
        console.log(input);
        let output;
        let uncompressedSize = (input.length << 8) - input.length - 2526;  // size estimate for uncompressed data!

        // Decode whole file.
        do {
            output = new Uint8Array(uncompressedSize);
            uncompressedSize = decodeLz4Block(input, output, 8 + 4);  // skip 8 byte magic number + 4 byte data size field
            // if there's more data than our output estimate, create a bigger output array and retry (at most one retry)
        } while (uncompressedSize > output.length);

        output = output.slice(0, uncompressedSize); // remove excess bytes

        let decodedText = new TextDecoder().decode(output);
        onRead(decodedText);
    };

    if (onError) {
        reader.onerror = onError;
    }

    reader.readAsArrayBuffer(file); // read as bytes
}

function writeMozlz4File(content) {
    console.log('run')

    let input = Uint8Array.from(content, c => c.codePointAt(0));
    // let input = new TextDecoder().encode(content);

    console.log(input);

    let output = new Uint8Array(compressBound(input.length));

    console.log(output);

    var compressedSize = compress(input, output);
    output = output.slice(0, compressedSize);

    console.log(output);

    let mozlz4_magic = [109, 111, 122, 76, 122, 52, 48, 0];
    let decomp_size = [0, 133, 103, 0];

    // moz header + bound
    mozlz4_magic.push(...decomp_size);

    console.log(mozlz4_magic);

    let mozHeader = Uint8Array.from(mozlz4_magic);
    let mozOutput = new Uint8Array(mozHeader.length + output.length);

    mozOutput.set(mozHeader)
    mozOutput.set(output, mozHeader.length);

    console.log(mozHeader);
    console.log(mozOutput);

    return mozOutput;
}