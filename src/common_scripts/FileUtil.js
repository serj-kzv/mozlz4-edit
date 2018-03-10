class FileUtil {

    static readFileAsTxt(file) {
        return new Promise(resolve => {
            const fileReader = new FileReader();

            fileReader.addEventListener('loadend', event => {
                const fileTxt = event.target.result;

                resolve(fileTxt);
            });

            fileReader.readAsText(file);
        });
    }

    static readFileAsArrayBuffer(file) {
        return new Promise(resolve => {
            const fileReader = new FileReader();

            fileReader.addEventListener('loadend', event => {
                resolve(event.target.result);
            });
            fileReader.readAsArrayBuffer(file);
        });
    }

    static async readFileAsUint8Array(file) {
        return new Uint8Array(await FileUtil.readFileAsArrayBuffer(file));
    }

    static async saveAsData(content, type, isNewTab, fileName) {
        this.implementMethodErrMsg();
    }

    static async saveData(content, fileName) {
        this.implementMethodErrMsg();
    }

    static async openAsJson(content) {
        this.implementMethodErrMsg();
    }

    static implementMethodErrMsg() {
        throw new Error('The method has to be implemented!');
    }

    static unshiftUint8ArrayToFile(file, uInt8Array) {
        const output = new Uint8Array(uInt8Array.length + file.length);

        output.set(uInt8Array);
        output.set(file, uInt8Array.length);

        return output;
    }
}




