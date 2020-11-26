export default class MozLz4ArchiverCommand {
    constructor(command) {
        this.typeName = command.typeName;
        this.header = command.header;
        this.decompressSize = command.decompressSize;
    }
}
