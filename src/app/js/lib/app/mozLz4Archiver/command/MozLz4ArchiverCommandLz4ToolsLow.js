class MozLz4ArchiverCommandLz4ToolsLow extends MozLz4ArchiverCommand {
    constructor() {
        super({
            TYPE_NAME: 'Lz4ToolsLow',
            HEADER: Uint8Array.from([2, 33, 76, 24]),
            DECOMPRESS_SIZE: Uint8Array.from([254, 254, 254, 127]),
            TRUNCATE_HEADER: true,
            TRUNCATE_DECOMPRESS_SIZE: true,
            TRUNCATE_SIZE_MANUALLY: false
        });
    }
}