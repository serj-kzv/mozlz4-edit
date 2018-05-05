class FileUtil {

    static readFileAsTxt(file) {
        return FileUtil.readFileAs(file, 'readAsText');
    }

    static readFileAsBase64(file) {
        return FileUtil.readFileAs(file, 'readAsDataURL');
    }

    static readFileAsArrayBuffer(file) {
        return FileUtil.readFileAs(file, 'readAsArrayBuffer');
    }

    static readFileAs(file, converterName) {
        return new Promise(resolve => {
            const fileReader = new FileReader();

            fileReader.addEventListener('loadend', async event => {
                resolve(event.target.result);
            });
            fileReader[converterName](file);
        });
    }

    static async readFileAsUint8Array(file) {
        return new Uint8Array(await FileUtil.readFileAsArrayBuffer(file));
    }

    static unshiftUint8ArrayToFile(file, uInt8Array) {
        const output = new Uint8Array(uInt8Array.length + file.length);

        output.set(uInt8Array);
        output.set(file, uInt8Array.length);

        return output;
    }

    static isEqual(file1, file2) {
        return file1.length === file2.length ? !file1.some((byte, index) => byte !== file2[index]) : false;
    }
}




