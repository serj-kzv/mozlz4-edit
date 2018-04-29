class OpenFileUtil extends FileUtil {
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
                browser.tabs.onRemoved.removeListener(onRemovedListener);
                browser.tabs.onReplaced.removeListener(onReplacedListener);
                browser.tabs.onUpdated.removeListener(onUpdatedListener);
                window.URL.revokeObjectURL(url);
            }
        };

        // clear memory on tab replaced event
        onReplacedListener = (addedTabId, removedTabId) => {
            const isRunAndCurrent = currentTab != null && currentTab.id === tabId;

            if (isRunAndCurrent) {
                browser.tabs.onRemoved.removeListener(onRemovedListener);
                browser.tabs.onReplaced.removeListener(onReplacedListener);
                browser.tabs.onUpdated.removeListener(onUpdatedListener);
                window.URL.revokeObjectURL(url);
            }
        };

        // clear memory on a tab content was replaced
        onUpdatedListener = (tabId, changeInfo, tab) => {
            const isRunAndCurrent = currentTab != null && currentTab.id === tabId;

            if (isRunAndCurrent) {
                // check if a original tab content was replaced
                if (!isCompleted && tab.status === 'complete' && url === tab.url) {
                    isCompleted = true;
                } else if (url !== tab.url) {
                    browser.tabs.onRemoved.removeListener(onRemovedListener);
                    browser.tabs.onReplaced.removeListener(onReplacedListener);
                    browser.tabs.onUpdated.removeListener(onUpdatedListener);
                    window.URL.revokeObjectURL(url);
                }
            }
        };

        browser.tabs.onRemoved.addListener(onRemovedListener);
        browser.tabs.onReplaced.addListener(onReplacedListener);
        browser.tabs.onUpdated.addListener(onUpdatedListener);

        try {
            currentTab = await browser.tabs.create({url});

            return currentTab;
        } catch (e) {
            // clear memory on tab open event error
            browser.tabs.onRemoved.removeListener(onRemovedListener);
            browser.tabs.onReplaced.removeListener(onReplacedListener);
            browser.tabs.onUpdated.removeListener(onUpdatedListener);
            window.URL.revokeObjectURL(url);

            return false;
        }
    }
}