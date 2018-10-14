export default class SaveFileUtil {
    static saveData(content, fileName, webExt = true) {
        if (webExt) {
            return this.webExtSaveAsData(content, 'octet/stream', false, fileName);
        }
        return this.browserSaveAsData(content, 'octet/stream', false, fileName);
    }

    /**
     * Returns promise with deltaId if all is fine. Returns promise with an exception if an error is occurred.
     */
    static webExtSaveAsData(content, type, isNewTab, filename) {
        return new Promise((resolve, reject) => {
            let deltaId = null, changedListener = null, erasedListener = null, isMemoryCleared = false;
            const
                url = window.URL.createObjectURL(new Blob([content], { type })),
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
                browser.downloads.download({ url, filename }).then(currentDeltaId => {
                    deltaId = currentDeltaId;
                });
            } catch (e) {
                // clear a memory by url if an error is occurred or the downloading is canceled
                clearMemory();
                resolve(deltaId);
            }
        });
    }

    static browserSaveAsData(content, type, isNewTab, filename) {
        const iframe = document.createElement('iframe');
        const url = window.URL.createObjectURL(new Blob([content], { type }));
        const
            focusListener = evt => {
                console.log(evt);
                iframe.removeEventListener("focus", focusListener);
            },
            loadListener = evt => {
                evt.preventDefault();
                evt.returnValue = '';
                console.log(evt);
                iframe.removeEventListener('beforeunload', loadListener);
            };

        console.log(url);

        iframe.style.display = 'none';
        iframe.src = url;
        iframe.addEventListener('load', loadListener);
        iframe.addEventListener("beforeunload", focusListener);
        document.body.appendChild(iframe);
        // document.body.removeChild(iframe)
    }
}