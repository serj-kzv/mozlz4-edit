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

    static saveAsDataWithLink(content, type, isNewTab, fileName) {
        const a = document.createElement('a');

        document.body.appendChild(a);
        a.style = 'display: none';

        const url = window.URL.createObjectURL(new Blob([content], {type}));

        a.href = url;
        a.target = isNewTab ? '_blank' : '_self';
        if (fileName != null) {
            a.download = fileName;
        }
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }

    static saveAsDataWithTab(content, type, isNewTab, fileName) {
        const url = window.URL.createObjectURL(new Blob([content], {type}));

        const popupWindow = window.open(
            url,
            '',
            ''
        );

        popupWindow.addEventListener('unload', event => {
            window.URL.revokeObjectURL(url);
        });
        popupWindow.addEventListener('abort', event => {
            window.URL.revokeObjectURL(url);
        });
        popupWindow.addEventListener('beforeunload', event => {
            window.URL.revokeObjectURL(url);
        });
    }

    static saveData2(content, fileName) {
        Util.saveAsDataWithLink(content, 'octet/stream', false, fileName);
    }

    static openAsJson2(content) {
        Util.saveAsDataWithLink(content, 'application/json', true, null);
    }

    static saveData(content, fileName) {
        Util.saveAsDataWithTab(content, 'octet/stream', false, fileName);
    }

    static openAsJson(content) {
        Util.saveAsDataWithTab(content, 'application/json', true, null);
    }

    static readFileAsArrayBuffer(file) {
        return new Promise(resolve => {
            const fileReader = new FileReader();

            fileReader.addEventListener('loadend', event => {
                let fileBlob = event.target.result;

                resolve(fileBlob);
            });
            fileReader.readAsArrayBuffer(file);
        });
    }

    static async readFileAsUint8Array(file) {
        return new Uint8Array(await Util.readFileAsArrayBuffer(file));
    }
}



