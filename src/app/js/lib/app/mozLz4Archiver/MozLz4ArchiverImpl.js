class MozLz4ArchiverImpl extends MozLz4Archiver {
    constructor(file, command = new MozLz4ArchiverCommandLz4()) {
        super();
        this.file = file;
        this.command = command;
    }

    decode() {
        const header = this.getHeader(this.file);
        const decompressSizeHeader = this.getDecompressSizeHeader(this.file);
        const decompressSize = MozLz4Archiver.sizeHeaderToDecompSize(decompressSizeHeader);
        let file = null;

        if (this.command.TRUNCATE_SIZE_MANUALLY) {
            file = super.decode(this.getBody(this.file), {use: false, size: null}, false);
            file = MozLz4Archiver.removeLastZeros(file);
        } else {
            if (this.command.USE_SIZE_HEADER) {
                file = super.decode(this.getBody(this.file), {use: true, size: decompressSize}, true);
            } else {
                file = super.decode(this.getBody(this.file), {use: false, size: null}, true);
            }
        }

        return {
            typeName: this.command.TYPE_NAME,
            file,
            header,
            decompressSizeHeader,
            decompressSize
        };
    }

    encode() {
        let file = super.encode(this.file);
        const decompressedSizeHeader = MozLz4Archiver.uInt32sToUInt8s(file.size);

        file = this.addDecompressSize(file.body, decompressedSizeHeader);

        return this.addHeader(file);
    }

    convert() {
    }

    addDecompressSize(file, decompressSizeHeader) {
        return MozLz4Archiver.unshiftUint8ArrayToFile(file, decompressSizeHeader);
    }

    addHeader(file) {
        return MozLz4Archiver.unshiftUint8ArrayToFile(file, this.command.HEADER);
    }

    getHeader() {
        return this.file.slice(0, this.command.HEADER.length);
    }

    getDecompressSizeHeader() {
        return this.file.slice(this.command.HEADER.length, this.command.HEADER.length + this.command.DECOMPRESS_SIZE.length);
    }

    getBody() {
        if (this.command.TRUNCATE_HEADER) {
            if (this.command.TRUNCATE_DECOMPRESS_SIZE) {
                return this.file.slice(this.command.HEADER.length + this.command.DECOMPRESS_SIZE.length);
            } else {
                return this.file.slice(this.command.HEADER.length);
            }
        } else {
            return this.file;
        }
    }

    isThisType() {
        return MozLz4Archiver.isEqual(this.getHeader(), this.command.HEADER);
    }
}