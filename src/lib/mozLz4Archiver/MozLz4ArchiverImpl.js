class MozLz4ArchiverImpl extends MozLz4Archiver {
    constructor(file, command = new MozLz4ArchiverCommandLz4()) {
        super();
        this.file = file;
        this.TYPE_NAME = command.TYPE_NAME;
        this.HEADER = command.HEADER;
        this.DECOMPRESS_SIZE = command.DECOMPRESS_SIZE;
    }

    decode() {
        const mozHeader = this.getHeader(this.file);
        const decompSize = this.getDecompressSize(this.file);

        let file = this.getBody(this.file);

        file = super.decode(this.file);

        return {
            file,
            mozHeader,
            decompSize
        };
    }

    encode() {
        let lz4 = super.encode(this.file);

        lz4 = this.addDecompressSize(lz4);

        return this.addHeader(lz4);
    }

    convert() {
    }

    addDecompressSize() {
        return this.unshiftUint8ArrayToFile(this.file, this.DECOMPRESS_SIZE);
    }

    addHeader() {
        return this.unshiftUint8ArrayToFile(this.file, this.HEADER);
    }

    getHeader() {
        return this.file.slice(0, this.HEADER.length);
    }

    getDecompressSize() {
        return this.file.slice(this.HEADER.length, this.HEADER.length + this.DECOMPRESS_SIZE.length);
    }

    getBody() {
        return this.file.slice(this.HEADER.length + this.DECOMPRESS_SIZE.length);
    }

    isThisType() {
        return MozLz4Archiver.isEqual(this.getHeader(), this.HEADER);
    }
}