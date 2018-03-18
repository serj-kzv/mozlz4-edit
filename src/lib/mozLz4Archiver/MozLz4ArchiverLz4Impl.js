class MozLz4ArchiverLz4Impl extends MozLz4Archiver {
    constructor() {
        super();
        this.HEADER = Uint8Array.from([24, 77, 34, 4]);
    }
}