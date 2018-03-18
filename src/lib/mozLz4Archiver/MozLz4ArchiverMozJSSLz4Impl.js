class MozLz4ArchiverMozJSSLz4Impl extends MozLz4Archiver {
    constructor() {
        super();
        this.HEADER = Uint8Array.from([109, 111, 122, 74, 83, 83, 67, 76, 122, 52, 48, 118, 48, 48, 49, 0]);
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