class SaveFileUtil {
    static async saveData(content, fileName) {
        return this.saveAsData(content, 'octet/stream', false, fileName);
    }

    static async saveAsData(content, type, isNewTab, filename) {
        const url = window.URL.createObjectURL(new Blob([content], {type}));
        let deltaId = null, changedListener = null, erasedListener = null;

        // clear memory by url if error is occurred or downloading is completed
        changedListener = delta => {
            const isRunAndCurrent = deltaId != null && delta.id === deltaId;

            if (isRunAndCurrent) {
                const isCompleted = delta.state.current === 'complete';
                const isInterrupted = delta.state.current === 'interrupted';

                if (isCompleted || isInterrupted) {
                    browser.downloads.onChanged.removeListener(changedListener);
                    browser.downloads.onErased.removeListener(erasedListener);
                    window.URL.revokeObjectURL(url);
                }
            }
        };

        // clear memory by url if downloading is erased
        erasedListener = downloadId => {
            const isRunAndCurrent = deltaId != null && downloadId === deltaId;

            if (isRunAndCurrent) {
                browser.downloads.onChanged.removeListener(changedListener);
                browser.downloads.onErased.removeListener(erasedListener);
                window.URL.revokeObjectURL(url);
            }
        };

        browser.downloads.onChanged.addListener(changedListener);
        browser.downloads.onErased.addListener(erasedListener);

        try {
            deltaId = await browser.downloads.download({url, filename});

            return deltaId;
        } catch (e) {
            // clear memory by url if error is occurred or downloading is canceled
            browser.downloads.onChanged.removeListener(changedListener);
            browser.downloads.onErased.removeListener(erasedListener);
            window.URL.revokeObjectURL(url);

            return false;
        }
    }
}