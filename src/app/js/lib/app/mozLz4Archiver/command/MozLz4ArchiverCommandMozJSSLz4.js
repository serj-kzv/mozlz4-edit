import MozLz4ArchiverCommand from './MozLz4ArchiverCommand.js';

export default class MozLz4ArchiverCommandMozJSSLz4 extends MozLz4ArchiverCommand {
    constructor() {
        super({
            TYPE_NAME: 'mozJSSCLz40v001',
            HEADER: Uint8Array.from([109, 111, 122, 74, 83, 83, 67, 76, 122, 52, 48, 118, 48, 48, 49, 0]),
            DECOMPRESS_SIZE: Uint8Array.from([254, 254, 254, 127]),
            TRUNCATE_HEADER: true,
            TRUNCATE_DECOMPRESS_SIZE: true,
            TRUNCATE_SIZE_MANUALLY: false,
            USE_SIZE_HEADER: true
        });
    }
}