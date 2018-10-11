export default class MozLz4ArchiverCommand {
    constructor(command) {
        this.TYPE_NAME = command.TYPE_NAME;
        this.HEADER = command.HEADER;
        this.DECOMPRESS_SIZE = command.DECOMPRESS_SIZE;
        this.TRUNCATE_HEADER = command.TRUNCATE_HEADER;
        this.TRUNCATE_DECOMPRESS_SIZE = command.DECOMPRESS_SIZE;
        this.TRUNCATE_SIZE_MANUALLY = command.TRUNCATE_SIZE_MANUALLY;
        this.USE_SIZE_HEADER = command.USE_SIZE_HEADER;
    }
}