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
        this.USE_SIZE_HEADER = command.USE_SIZE_HEADER;
    }

    decode() {
        const header = this.getHeader(this.file);
        const decompressSizeHeader = this.getDecompressSizeHeader(this.file);
        const decompressSize = MozLz4Archiver.sizeHeaderToDecompSize(decompressSizeHeader);
        let file = null;

        if (this.TRUNCATE_SIZE_MANUALLY) {
            file = super.decode(this.getBody(this.file), {use: false, size: null}, false);
            file = MozLz4Archiver.removeLastZeros(file);
        } else {
            if (this.USE_SIZE_HEADER) {
                file = super.decode(this.getBody(this.file), {use: true, size: decompressSize}, false);
            } else {
                file = super.decode(this.getBody(this.file));
            }
        }

        return {
            file,
            header,
            decompressSizeHeader,
            decompressSize
        };
    }

    encode() {
        // TODO: Find out why it's worked
        const magicSize = this.file.length + 8;

        const decompressSizeHeader = MozLz4Archiver.uInt32sToUInt8s(magicSize);
        console.log(this.file.length)
        console.log(decompressSizeHeader)
        // const decompressSizeHeader = Uint8Array.from([254, 254, 254, 127]);
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