class SaveWithAPIFileUtil extends FileUtil {
    static async saveData(content, fileName) {
        this.saveAsData(content, 'octet/stream', false, fileName);
    }

    static async openAsJson(content) {
        this.saveAsData(content, 'application/json', true, null);
    }

    static async saveAsData(content, type, isNewTab, fileName) {
        const url = window.URL.createObjectURL(new Blob([content], {type}));

        this.saveBlobByUrl(url, fileName);
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
}