class MozLz4ArchiverImpl extends MozLz4Archiver {
    constructor(file, command = new MozLz4ArchiverCommandLz4()) {
        super();
        this.file = file;
        this.TYPE_NAME = command.TYPE_NAME;
        this.HEADER = command.HEADER;
        this.DECOMPRESS_SIZE = command.DECOMPRESS_SIZE;
        this.TRUNCATE_HEADER = command.TRUNCATE_HEADER;
        this.TRUNCATE_DECOMPRESS_SIZE = command.TRUNCATE_DECOMPRESS_SIZE;
    }

    decode() {
        const header = this.getHeader(this.file);
        const decompressSize = this.getDecompressSize(this.file);
        const file = super.decode(this.getBody(this.file));

        return {
            file,
            header,
            decompressSize
        };
    }

    encode() {
        let file = super.encode(this.file);

        file = this.addDecompressSize(file);

        return this.addHeader(file);
    }

    convert() {
    }

    addDecompressSize(file) {
        return MozLz4Archiver.unshiftUint8ArrayToFile(file, this.DECOMPRESS_SIZE);
    }

    addHeader(file) {
        return MozLz4Archiver.unshiftUint8ArrayToFile(file, this.HEADER);
    }

    getHeader() {
        return this.file.slice(0, this.HEADER.length);
    }

    getDecompressSize() {
        return this.file.slice(this.HEADER.length, this.HEADER.length + this.DECOMPRESS_SIZE.length);
    }

    getBody() {
        if (this.TRUNCATE_HEADER && this.TRUNCATE_DECOMPRESS_SIZE) {
            return this.file.slice(this.HEADER.length + this.DECOMPRESS_SIZE.length);
        } else if (this.TRUNCATE_HEADER) {
            return this.file.slice(this.HEADER.length);
        } else {
            return this.file;
        }
    }

    isThisType() {
        return MozLz4Archiver.isEqual(this.getHeader(), this.HEADER);
    }
}