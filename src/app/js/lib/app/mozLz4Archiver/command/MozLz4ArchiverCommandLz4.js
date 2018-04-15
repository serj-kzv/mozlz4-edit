class MozLz4ArchiverCommandLz4 extends MozLz4ArchiverCommand {
    constructor() {
        super({
            TYPE_NAME: 'Lz4',
            HEADER: Uint8Array.from([24, 77, 34, 4]),
            DECOMPRESS_SIZE: Uint8Array.from([254, 254, 254, 127]),
            TRUNCATE_HEADER: true,
            TRUNCATE_DECOMPRESS_SIZE: true
        });
    }
}