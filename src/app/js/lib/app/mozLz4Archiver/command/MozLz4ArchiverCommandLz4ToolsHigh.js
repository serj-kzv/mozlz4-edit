class MozLz4ArchiverCommandLz4ToolsHigh extends MozLz4ArchiverCommand {
    constructor() {
        super({
            TYPE_NAME: 'Lz4ToolsHigh',
            HEADER: Uint8Array.from([4, 34, 77, 24, 100, 64, -89]),
            DECOMPRESS_SIZE: Uint8Array.from([254, 254, 254, 127]),
            TRUNCATE_HEADER: true,
            TRUNCATE_DECOMPRESS_SIZE: true,
            TRUNCATE_SIZE_MANUALLY: true
        });
    }
}