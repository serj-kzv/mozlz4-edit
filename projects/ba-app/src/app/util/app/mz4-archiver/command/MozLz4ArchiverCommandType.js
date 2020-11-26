const MozLz4ArchiverCommandType = Object.freeze({
    NONE: 'none',
    MOZ_LZ4: 'MozLz4',
    MOZ_JSSC_LZ40V001: 'mozJSSCLz40v001',
    isNone(typeName) {
        return typeName === MozLz4ArchiverCommandType.NONE;
    },
    isMozLz4(typeName) {
        return typeName === MozLz4ArchiverCommandType.MOZ_LZ4;
    },
    isMozJSSCLz40v001(typeName) {
        return typeName === MozLz4ArchiverCommandType.MOZ_JSSC_LZ40V001;
    }
});

export default MozLz4ArchiverCommandType;
