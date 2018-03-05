class Util {
    static isDefinedVar(variable) {
        return typeof variable !== 'undefined';
    }

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

    // TODO: check memory leak https://stackoverflow.com/a/32216561
    static saveData(content, fileName) {
        const a = document.createElement('a');

        document.body.appendChild(a);
        a.style = 'display: none';

        const blob = new Blob([content], {
            type: 'octet/stream'
        });
        const url = window.URL.createObjectURL(blob);

        a.href = url;
        a.download = fileName;
        console.log(url);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }

    // TODO: check memory leak https://stackoverflow.com/a/32216561
    static openAsJson(json) {
        const a = document.createElement('a');

        document.body.appendChild(a);
        a.style = 'display: none';

        const blob = new Blob([json], {
            type: 'application/json'
        });
        const url = window.URL.createObjectURL(blob);

        console.log(url);

        a.href = url;
        a.target = '_blank';
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }

    static readArrayBufferOfFile(file) {
        return new Promise(resolve => {
            const fileReader = new FileReader();

            fileReader.addEventListener('loadend', event => {
                let fileBlob = event.target.result;

                resolve(fileBlob);
            });
            fileReader.readAsArrayBuffer(file);
        });
    }

    static async readUint8ArrayOfFile(file) {
        return new Uint8Array(await Util.readArrayBufferOfFile(file));
    }
}



