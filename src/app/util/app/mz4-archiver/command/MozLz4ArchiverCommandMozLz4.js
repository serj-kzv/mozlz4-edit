import MozLz4ArchiverCommandType from './MozLz4ArchiverCommand.js';

export default class MozLz4ArchiverCommandMozLz4 extends MozLz4ArchiverCommandType {
    constructor() {
        super({
            typeName: 'MozLz4',
            header: Uint8Array.from([109, 111, 122, 76, 122, 52, 48, 0]),
            decompressSize: Uint8Array.from([254, 254, 254, 127])
        });
    }
}
