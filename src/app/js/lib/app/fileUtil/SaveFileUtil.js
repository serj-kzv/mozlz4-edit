export default class SaveFileUtil {
    static saveData(content, fileName, downloadingType = null) {
        const CFG = SaveFileUtil.getCfg();

        if (downloadingType == null) {
            downloadingType = CFG.WEB_EXT;
        }
        switch (true) {
            case downloadingType === CFG.BROWSER_IFRAME: {
                return new Promise(resolve =>
                    resolve(this.browserSaveAsDataIframe(content, 'octet/stream', false, fileName)));
            }
            case downloadingType === CFG.BROWSER_LINK: {
                return new Promise(resolve =>
                    resolve(this.browserSaveAsDataLink(content, 'octet/stream', false, fileName)));
            }
            case downloadingType === CFG.WEB_EXT: {
                return this.webExtSaveAsData(content, 'octet/stream', false, fileName);
            }
        }

        return new Promise((resolve, reject) => reject('Error. Downloading type is wrong.'));
    }

    /**
     * Returns promise with deltaId if all is fine. Returns promise with an exception if an error is occurred.
     */
    static webExtSaveAsData(content, type, isNewTab, filename) {
        return new Promise((resolve, reject) => {
            let deltaId = null, changedListener = null, erasedListener = null, isMemoryCleared = false;
            const
                url = window.URL.createObjectURL(new Blob([content], {type})),
                clearMemory = () => {
                    if (!isMemoryCleared) {
                        isMemoryCleared = true;
                        browser.downloads.onChanged.removeListener(changedListener);
                        browser.downloads.onErased.removeListener(erasedListener);
                        window.URL.revokeObjectURL(url);
                    }
                };

            // clear a memory by an url if an error is occurred or the downloading is completed
            changedListener = delta => {
                const isRunAndCurrent = deltaId != null && delta.id === deltaId;

                if (isRunAndCurrent) {
                    const state = delta.state, error = delta.error;

                    // An error. Possibly the file is busy.
                    if (error !== undefined) {
                        console.error(error);
                        clearMemory();
                        reject('An error. Possibly the file is busy.');
                    } else {
                        const currentState = state.current;

                        if (currentState === 'complete' || currentState === 'interrupted') {
                            clearMemory();
                            resolve(deltaId);
                        }
                    }
                }
            };

            // clear a memory by an url if the downloading is erased
            erasedListener = downloadId => {
                const isRunAndCurrent = deltaId != null && downloadId === deltaId;

                if (isRunAndCurrent) {
                    clearMemory();
                    resolve(deltaId);
                }
            };

            browser.downloads.onChanged.addListener(changedListener);
            browser.downloads.onErased.addListener(erasedListener);

            try {
                browser.downloads.download({url, filename}).then(currentDeltaId => {
                    deltaId = currentDeltaId;
                });
            } catch (e) {
                // clear a memory by url if an error is occurred or the downloading is canceled
                clearMemory();
                resolve(deltaId);
            }
        });
    }

    static browserSaveAsDataIframe(content, type, isNewTab, filename) {
        const id = 'SaveFileUtil-browserSaveAsData-iframe';
        let iframe = document.querySelector(`#${id}`);

        if (iframe != null) {
            window.URL.revokeObjectURL(iframe.src);
            iframe.remove();
        }
        iframe = document.createElement('iframe');
        iframe.id = id;
        iframe.style.display = 'none';

        const url = window.URL.createObjectURL(new Blob([content], {type}));

        iframe.src = url;
        document.body.appendChild(iframe);
        window.URL.revokeObjectURL(url);

        return url;
    }

    static browserSaveAsDataLink(content, type, isNewTab, filename) {
        const id = 'SaveFileUtil-browserSaveAsData-link';
        let a = document.querySelector(`#${id}`);

        if (a != null) {
            window.URL.revokeObjectURL(a.href);
            a.remove();
        }
        a = document.createElement('a');
        a.id = id;
        a.style.display = 'none';
        document.body.appendChild(a);

        const url = window.URL.createObjectURL(new Blob([content], {type}));

        a.href = url;
        a.download = filename; // gives it a name via an a tag
        a.click();
        window.URL.revokeObjectURL(url);

        return url;
    }

    static getCfg() {
        return Object.freeze({
            BROWSER_IFRAME: 'browserIframe',
            BROWSER_LINK: 'browserLink',
            WEB_EXT: 'webExt'
        });
    }
}