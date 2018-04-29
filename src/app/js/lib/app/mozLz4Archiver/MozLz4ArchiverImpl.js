class MozLz4ArchiverImpl extends MozLz4Archiver {
    constructor(file, command = new MozLz4ArchiverCommandLz4()) {
        super();
        this.file = file;
        this.TYPE_NAME = command.TYPE_NAME;
        this.HEADER = command.HEADER;
        this.DECOMPRESS_SIZE = command.DECOMPRESS_SIZE;
        this.TRUNCATE_HEADER = command.TRUNCATE_HEADER;
        this.TRUNCATE_DECOMPRESS_SIZE = command.TRUNCATE_DECOMPRESS_SIZE;
        this.TRUNCATE_SIZE_MANUALLY = command.TRUNCATE_SIZE_MANUALLY;
    }

    decode() {
        const header = this.getHeader(this.file);
        const decompressSizeHeader = this.getDecompressSizeHeader(this.file);
        let file = null;

        if (this.TRUNCATE_SIZE_MANUALLY) {
            file = super.decode(this.getBody(this.file), false);
            file = MozLz4Archiver.removeLastZeros(file);
        } else {
            file = super.decode(this.getBody(this.file));
        }

        return {
            file,
            header,
            decompressSizeHeader
        };
    }

    encode() {
        const decompressSizeHeader = MozLz4Archiver.uInt32sToUInt8s(this.file.length);
        let file = super.encode(this.file);

        file = this.addDecompressSize(file, decompressSizeHeader);

        return this.addHeader(file);
    }

    convert() {
    }

    addDecompressSize(file, decompressSizeHeader) {
        return MozLz4Archiver.unshiftUint8ArrayToFile(file, decompressSizeHeader);
    }

    addHeader(file) {
        return MozLz4Archiver.unshiftUint8ArrayToFile(file, this.HEADER);
    }

    getHeader() {
        return this.file.slice(0, this.HEADER.length);
    }

    getDecompressSizeHeader() {
        return this.file.slice(this.HEADER.length, this.HEADER.length + this.DECOMPRESS_SIZE.length);
    }

    getBody() {
        if (this.TRUNCATE_HEADER) {
            if (this.TRUNCATE_DECOMPRESS_SIZE) {
                return this.file.slice(this.HEADER.length + this.DECOMPRESS_SIZE.length);
            } else {
                return this.file.slice(this.HEADER.length);
            }
        } else {
            return this.file;
        }
    }

    isThisType() {
        return MozLz4Archiver.isEqual(this.getHeader(), this.HEADER);
    }
}