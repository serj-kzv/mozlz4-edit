import MozLz4ArchiverCommand from '/app/js/lib/app/mozLz4Archiver/command/MozLz4ArchiverCommand.js';

export default class MozLz4ArchiverCommandMozLz4 extends MozLz4ArchiverCommand {
    constructor() {
        super({
            TYPE_NAME: 'MozLz4',
            HEADER: Uint8Array.from([109, 111, 122, 76, 122, 52, 48, 0]),
            DECOMPRESS_SIZE: Uint8Array.from([254, 254, 254, 127]),
            TRUNCATE_HEADER: true,
            TRUNCATE_DECOMPRESS_SIZE: true,
            TRUNCATE_SIZE_MANUALLY: false,
            USE_SIZE_HEADER: true
        });
    }
}