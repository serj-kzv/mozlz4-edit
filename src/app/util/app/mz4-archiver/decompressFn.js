import MozLz4ArchiverCommandMozJSSLz4 from "./command/MozLz4ArchiverCommandMozJSSLz4";
import MozLz4ArchiverCommandMozLz4 from "./command/MozLz4ArchiverCommandMozLz4";
import MozLz4ArchiverCommandType from "./command/MozLz4ArchiverCommandType";
import decodeFn from "./decodeFn";

const decompressFn = async file => {
    const commands = [
        new MozLz4ArchiverCommandMozLz4(),
        new MozLz4ArchiverCommandMozJSSLz4(),
    ];

    for (let i = 0; i < commands.length; i++) {
        const decodedFile = await decodeFn(file, commands[i]);

        if (decodedFile) {
            return decodedFile;
        }
    }

    return {
        file,
        command: {typeName: MozLz4ArchiverCommandType.NONE, header: null, decompressSize: -1},
        decompressSize: -1
    };
};

export default decompressFn;
