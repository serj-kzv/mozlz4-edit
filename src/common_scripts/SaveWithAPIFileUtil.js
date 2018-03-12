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
            isLoaded = false,
            currentTab = null,
            onRemovedListener = null,
            onReplacedListener = null,
            onUpdatedListener = null;

        // clear memory on tab closed
        onRemovedListener = (tabId, removeInfo) => {
            const isCurrent = currentTab != null && currentTab.id === tabId;

            if (isCurrent) {
                browserAPI.tabs.onRemoved.removeListener(onRemovedListener);
                browserAPI.tabs.onReplaced.removeListener(onReplacedListener);
                browserAPI.tabs.onUpdated.removeListener(onUpdatedListener);
                window.URL.revokeObjectURL(url);
            }
        };

        // clear memory on tab replaced
        onReplacedListener = (addedTabId, removedTabId) => {
            const isCurrent = currentTab != null && currentTab.id === removedTabId;

            if (isCurrent) {
                browserAPI.tabs.onRemoved.removeListener(onRemovedListener);
                browserAPI.tabs.onReplaced.removeListener(onReplacedListener);
                browserAPI.tabs.onUpdated.removeListener(onUpdatedListener);
                window.URL.revokeObjectURL(url);
            }
        };

        // clear memory on tab content replaced
        onUpdatedListener = (tabId, changeInfo, tab) => {
            const isCurrent = currentTab != null && currentTab.id === tabId;
            const isCurrentUrl = isCurrent && url === tab.url;
            const isCompleted = isCurrentUrl && tab.status === 'complete';

            // check if tab content was loaded
            if (!isLoaded && isCompleted) {
                isLoaded = true;
            }

            // check if original tab content was replaced
            if (!isCurrentUrl && isLoaded) {
                browserAPI.tabs.onRemoved.removeListener(onRemovedListener);
                browserAPI.tabs.onReplaced.removeListener(onReplacedListener);
                browserAPI.tabs.onUpdated.removeListener(onUpdatedListener);
                window.URL.revokeObjectURL(url);
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
            const isCurrent = deltaId != null && delta.id === deltaId;
            const isCompleted = isCurrent && delta.state.current === 'complete';
            const isInterrupted = isCurrent && delta.state.current === 'interrupted';

            if (isCompleted || isInterrupted) {
                browserAPI.downloads.onChanged.removeListener(changedListener);
                browserAPI.downloads.onErased.removeListener(erasedListener);
                window.URL.revokeObjectURL(url);
            }
        };

        // clear memory by url if downloading is erased
        erasedListener = downloadId => {
            const isCurrent = deltaId != null && downloadId === deltaId;

            if (isCurrent) {
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