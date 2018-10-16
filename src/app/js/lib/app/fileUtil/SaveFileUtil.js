export default class SaveFileUtil {
    static saveData(content, fileName, browser = false) {
        console.log(browser)
        if (browser) {
            const url = this.browserSaveAsData(content, 'octet/stream', false, fileName);

            return new Promise(resolve => resolve(url));
        }

        return this.webExtSaveAsData(content, 'octet/stream', false, fileName);
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

    static browserSaveAsData2(content, type, isNewTab, filename) {
        const id = 'SaveFileUtil-browserSaveAsData';
        let iframe = document.querySelector(`#${id}`);

        if (iframe != null) {
            iframe.remove();
        }
        iframe = document.createElement('iframe');
        iframe.id = id;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        console.log(iframe)
        iframe.contentDocument.head.title = '123';

        return iframe.src = window.URL.createObjectURL(new Blob([content], {type}));
    }

    static browserSaveAsData(content, type, isNewTab, filename) {
        const id = 'SaveFileUtil-browserSaveAsData';
        let iframe = document.querySelector(`#${id}`);

        if (iframe != null) {
            iframe.remove();
        }
        iframe = document.createElement('a');
        iframe.id = id;
        iframe.style.display = 'none';
        iframe.target = '_blank';
        iframe.setAttribute('target', '_blank');
        iframe.download = filename;
        iframe.setAttribute('download', filename);
        document.body.appendChild(iframe);

        console.log(iframe)
        // iframe.contentDocument.head.title = '123';

        iframe.href = window.URL.createObjectURL(new Blob([content], {type}));
        iframe.click();

        return iframe.href;
    }
}