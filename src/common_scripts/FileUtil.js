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
    }

    static async saveAsDataWithAPI(content, type, isNewTab, fileName) {
        const url = window.URL.createObjectURL(new Blob([content], {type}));

        FileUtil.saveBlobByUrl(url, fileName);
    }

    static async saveBlobByUrl(url, fileName) {
        let changedListener = null, erasedListener = null, deltaId = null;

        try {
            // clear memory by url if error is occurred or downloading is completed
            changedListener = delta => {
                const isCurrent = deltaId != null && delta.id === deltaId;
                const isCompleted = delta.state && delta.state.current === 'complete';
                const isInterrupted = delta.state && delta.state.current === 'interrupted';

                if (isCurrent && (isCompleted || isInterrupted)) {
                    CONFIG.getAPI().browser.browserAPI.downloads.onChanged.removeListener(changedListener);
                    window.URL.revokeObjectURL(url);
                }
            };

            CONFIG.getAPI().browser.browserAPI.downloads.onChanged.addListener(changedListener);

            // clear memory by url if downloading is erased
            erasedListener = downloadId => {
                const isCurrent = deltaId != null && downloadId === deltaId;

                if (isCurrent) {
                    CONFIG.getAPI().browser.browserAPI.downloads.onErased.removeListener(erasedListener);
                    window.URL.revokeObjectURL(url);
                }
            };

            CONFIG.getAPI().browser.browserAPI.downloads.onErased.addListener(erasedListener);

            deltaId = await CONFIG.getAPI().browser.browserAPI.downloads.download({
                url,
                filename: fileName
            });
        } catch (e) {
            // clear memory by url if error is occurred or downloading is canceled
            if (changedListener != null) {
                CONFIG.getAPI().browser.browserAPI.downloads.onChanged.removeListener(changedListener);
            }
            if (erasedListener != null) {
                CONFIG.getAPI().browser.browserAPI.downloads.onErased.removeListener(erasedListener);
            }

            window.URL.revokeObjectURL(url);
        }
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

    static saveData(content, fileName) {
        this.implementMethodErrMsg();
    }

    static openAsJson(content) {
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




