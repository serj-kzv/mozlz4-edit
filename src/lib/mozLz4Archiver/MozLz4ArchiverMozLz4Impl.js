class MozLz4ArchiverMozLz4Impl extends MozLz4Archiver {
    constructor() {
        super();
        this.HEADER = Uint8Array.from([109, 111, 122, 76, 122, 52, 48, 0]);
        this.DECOMPRESS_SIZE = Uint8Array.from([254, 254, 254, 127]);
    }

    decode(file) {
        const mozHeader = this.getHeader(file);
        const decompSize = this.getDecompressSize(file);

        file = this.getBody(file);
        file = super.decode(file);

        return {
            file,
            mozHeader,
            decompSize
        };
    }

    encode(data) {
        let lz4 = super.encode(data);

        lz4 = this.addDecompressSize(lz4);

        return this.addHeader(lz4);
    }

    convert(file) {
        let result = this.decode(file);

        result.file = this.encode(result.file);

        return result;
    }

    addDecompressSize(file) {
        return this.unshiftUint8ArrayToFile(file, this.DECOMPRESS_SIZE);
    }

    addHeader(file) {
        return this.unshiftUint8ArrayToFile(file, this.HEADER);
    }

    getHeader(file) {
        return file.slice(0, this.HEADER.length);
    }

    getDecompressSize(file) {
        return file.slice(this.HEADER.length, this.HEADER.length + this.DECOMPRESS_SIZE.length);
    }

    getBody(file) {
        return file.slice(this.HEADER.length + this.DECOMPRESS_SIZE.length);
    }
}