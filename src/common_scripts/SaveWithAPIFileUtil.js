class SaveWithAPIFileUtil extends FileUtil {
    static async saveData(content, fileName) {
        return this.saveAsData(content, 'octet/stream', false, fileName);
    }

    static async openAsJson(content) {
        return this.openAsData(content, 'application/json', null, null);
    }

    static async openAsData(content, type, isNewTab, filename) {
        const url = window.URL.createObjectURL(new Blob([content], {type}));
        let
            isCompleted = false,
            currentTab = null,
            onRemovedListener = null,
            onReplacedListener = null,
            onUpdatedListener = null;

        // clear memory on tab closed event
        onRemovedListener = (tabId, removeInfo) => {
            const isRunAndCurrent = currentTab != null && currentTab.id === tabId;

            if (isRunAndCurrent) {
                browserAPI.tabs.onRemoved.removeListener(onRemovedListener);
                browserAPI.tabs.onReplaced.removeListener(onReplacedListener);
                browserAPI.tabs.onUpdated.removeListener(onUpdatedListener);
                window.URL.revokeObjectURL(url);
            }
        };

        // clear memory on tab replaced event
        onReplacedListener = (addedTabId, removedTabId) => {
            const isRunAndCurrent = currentTab != null && currentTab.id === tabId;

            if (isRunAndCurrent) {
                browserAPI.tabs.onRemoved.removeListener(onRemovedListener);
                browserAPI.tabs.onReplaced.removeListener(onReplacedListener);
                browserAPI.tabs.onUpdated.removeListener(onUpdatedListener);
                window.URL.revokeObjectURL(url);
            }
        };

        // clear memory on a tab content was replaced
        onUpdatedListener = (tabId, changeInfo, tab) => {
            const isRunAndCurrent = currentTab != null && currentTab.id === tabId;

            if (isRunAndCurrent) {
                if (!isCompleted && tab.status === 'complete' && url === tab.url) {
                    isCompleted = true;
                }

                // check if a original tab content was replaced
                if (isCompleted && url !== tab.url) {
                    browserAPI.tabs.onRemoved.removeListener(onRemovedListener);
                    browserAPI.tabs.onReplaced.removeListener(onReplacedListener);
                    browserAPI.tabs.onUpdated.removeListener(onUpdatedListener);
                    window.URL.revokeObjectURL(url);
                }
            }
        };

        browserAPI.tabs.onRemoved.addListener(onRemovedListener);
        browserAPI.tabs.onReplaced.addListener(onReplacedListener);
        browserAPI.tabs.onUpdated.addListener(onUpdatedListener);

        try {
            currentTab = await browserAPI.tabs.create({url});

            return currentTab;
        } catch (e) {
            // clear memory on tab open event error
            browserAPI.tabs.onRemoved.removeListener(onRemovedListener);
            browserAPI.tabs.onReplaced.removeListener(onReplacedListener);
            browserAPI.tabs.onUpdated.removeListener(onUpdatedListener);
            window.URL.revokeObjectURL(url);

            return false;
        }
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
                    browserAPI.downloads.onChanged.removeListener(changedListener);
                    browserAPI.downloads.onErased.removeListener(erasedListener);
                    window.URL.revokeObjectURL(url);
                }
            }
        };

        // clear memory by url if downloading is erased
        erasedListener = downloadId => {
            const isRunAndCurrent = deltaId != null && downloadId === deltaId;

            if (isRunAndCurrent) {
                browserAPI.downloads.onChanged.removeListener(changedListener);
                browserAPI.downloads.onErased.removeListener(erasedListener);
                window.URL.revokeObjectURL(url);
            }
        };

        browserAPI.downloads.onChanged.addListener(changedListener);
        browserAPI.downloads.onErased.addListener(erasedListener);

        try {
            deltaId = await browserAPI.downloads.download({url, filename});

            return deltaId;
        } catch (e) {
            // clear memory by url if error is occurred or downloading is canceled
            browserAPI.downloads.onChanged.removeListener(changedListener);
            browserAPI.downloads.onErased.removeListener(erasedListener);
            window.URL.revokeObjectURL(url);

            return false;
        }
    }
}