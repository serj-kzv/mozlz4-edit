class SaveWithAPIFileUtil extends FileUtil {
    static async saveData(content, fileName) {
        this.saveAsData(content, 'octet/stream', false, fileName);
    }

    static async openAsJson(content) {
        this.openAsData(content, 'application/json');
    }

    static async openAsData(content, type) {
        const url = window.URL.createObjectURL(new Blob([content], {type}));
        let onRemovedListener = null, onReplacedListener = null, onUpdatedListener = null, currentTab = null;

        console.log(url);

        try {
            // clear memory on tab closed
            onRemovedListener = (tabId, removeInfo) => {
                const isCurrent = currentTab != null && currentTab.id === tabId;

                if (isCurrent) {
                    console.log('test1')
                    CONFIG.getAPI().browser.browserAPI.tabs.onRemoved.removeListener(onRemovedListener);
                    window.URL.revokeObjectURL(url);
                }
            };

            // clear memory on tab replaced
            onReplacedListener = (addedTabId, removedTabId) => {
                const isCurrent = currentTab != null && currentTab.id === removedTabId;
                console.log('test2')

                if (isCurrent) {
                    console.log('test2')

                    CONFIG.getAPI().browser.browserAPI.tabs.onReplaced.removeListener(onReplacedListener);
                    window.URL.revokeObjectURL(url);
                }
            };

            // clear memory on tab content replaced
            onUpdatedListener = (tabId, changeInfo, tab) => {
                const isCurrent = currentTab != null && currentTab.id === tabId;
                const isCurrentUrl = currentTab.url === tab.url;

                console.log('---')
                console.log(changeInfo.status)
                console.log(tab.url);
                console.log('---')


                if (isCurrent && !isCurrentUrl) {
                    console.log('test4')
                    CONFIG.getAPI().browser.browserAPI.tabs.onUpdated.removeListener(onUpdatedListener);
                    window.URL.revokeObjectURL(url);
                }
            };

            CONFIG.getAPI().browser.browserAPI.tabs.onRemoved.addListener(onRemovedListener);
            CONFIG.getAPI().browser.browserAPI.tabs.onReplaced.addListener(onReplacedListener);
            CONFIG.getAPI().browser.browserAPI.tabs.onUpdated.addListener(onUpdatedListener);

            currentTab = await CONFIG.getAPI().browser.browserAPI.tabs.create({url});
        } catch (e) {
            console.log('test3')


            // clear memory on tab open event error
            if (onRemovedListener != null) {
                CONFIG.getAPI().browser.browserAPI.tabs.onRemoved.addListener(onRemovedListener);
            }
            if (onReplacedListener != null) {
                CONFIG.getAPI().browser.browserAPI.tabs.onReplaced.addListener(onReplacedListener);
            }
            if (onUpdatedListener != null) {
                CONFIG.getAPI().browser.browserAPI.tabs.onUpdated.addListener(onUpdatedListener);
            }
            window.URL.revokeObjectURL(url);
        }
    }

    static async saveAsData(content, type, isNewTab, filename) {
        const url = window.URL.createObjectURL(new Blob([content], {type}));
        let changedListener = null, erasedListener = null, deltaId = null;

        try {
            // clear memory by url if error is occurred or downloading is completed
            changedListener = delta => {
                const isCurrent = deltaId != null && delta.id === deltaId;
                const isCompleted = delta.state && delta.state.current === 'complete';
                const isInterrupted = delta.state && delta.state.current === 'interrupted';

                if (isCurrent && (isCompleted || isInterrupted)) {
                    CONFIG.getAPI().browser.browserAPI.downloads.onChanged.removeListener(changedListener);
                    CONFIG.getAPI().browser.browserAPI.downloads.onErased.removeListener(erasedListener);
                    window.URL.revokeObjectURL(url);
                }
            };

            // clear memory by url if downloading is erased
            erasedListener = downloadId => {
                const isCurrent = deltaId != null && downloadId === deltaId;

                if (isCurrent) {
                    CONFIG.getAPI().browser.browserAPI.downloads.onChanged.removeListener(changedListener);
                    CONFIG.getAPI().browser.browserAPI.downloads.onErased.removeListener(erasedListener);
                    window.URL.revokeObjectURL(url);
                }
            };

            CONFIG.getAPI().browser.browserAPI.downloads.onChanged.addListener(changedListener);
            CONFIG.getAPI().browser.browserAPI.downloads.onErased.addListener(erasedListener);

            deltaId = await CONFIG.getAPI().browser.browserAPI.downloads.download({url, filename});
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