class MozLz4ArchiverCommandMozJSSLz4 extends MozLz4ArchiverCommand {
    constructor() {
        super({
            TYPE_NAME : 'MozJSSLz4',
            HEADER : Uint8Array.from([109, 111, 122, 74, 83, 83, 67, 76, 122, 52, 48, 118, 48, 48, 49, 0]),
            DECOMPRESS_SIZE : Uint8Array.from([254, 254, 254, 127])
        });
    }
}