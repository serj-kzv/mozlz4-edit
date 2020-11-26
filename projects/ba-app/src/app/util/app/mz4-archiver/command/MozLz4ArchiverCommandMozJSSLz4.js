import MozLz4ArchiverCommandType from './MozLz4ArchiverCommand.js';

export default class MozLz4ArchiverCommandMozJSSLz4 extends MozLz4ArchiverCommandType {
    constructor() {
        super({
            typeName: 'mozJSSCLz40v001',
            header: Uint8Array.from([109, 111, 122, 74, 83, 83, 67, 76, 122, 52, 48, 118, 48, 48, 49, 0]),
            decompressSize: Uint8Array.from([254, 254, 254, 127])
        });
    }
}
