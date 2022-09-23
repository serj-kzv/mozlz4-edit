const openAsDataFn = async (content, type, isNewTab, filename) => {
    let
        isCompleted = false,
        isMemoryCleared = false,
        currentTab = null,
        onRemovedListener = null,
        onReplacedListener = null,
        onUpdatedListener = null;
    const
        url = window.URL.createObjectURL(new Blob([content], {type})),
        clearMemory = () => {
            if (!isMemoryCleared) {
                isMemoryCleared = true;
                browser.tabs.onRemoved.removeListener(onRemovedListener);
                browser.tabs.onReplaced.removeListener(onReplacedListener);
                browser.tabs.onUpdated.removeListener(onUpdatedListener);
                window.URL.revokeObjectURL(url);
            }
        };

    // clear memory on a tab is closed event
    onRemovedListener = (tabId, removeInfo) => {
        const isRunAndCurrent = currentTab != null && currentTab.id === tabId;

        if (isRunAndCurrent) {
            clearMemory();
        }
    };

    // clear memory on a tab is replaced event
    onReplacedListener = (addedTabId, removedTabId) => {
        const isRunAndCurrent = currentTab != null && currentTab.id === removedTabId;

        if (isRunAndCurrent) {
            clearMemory();
        }
    };

    // clear memory on a tab content is replaced event
    onUpdatedListener = (tabId, changeInfo, tab) => {
        const isRunAndCurrent = currentTab != null && currentTab.id === tabId;

        if (isRunAndCurrent) {
            // checks if an original tab content was replaced
            if (!isCompleted && tab.status === 'complete' && url === tab.url) {
                isCompleted = true;
            } else if (url !== tab.url) {
                clearMemory();
            }
        }
    };

    browser.tabs.onRemoved.addListener(onRemovedListener);
    browser.tabs.onReplaced.addListener(onReplacedListener);
    browser.tabs.onUpdated.addListener(onUpdatedListener);

    try {
        return currentTab = await browser.tabs.create({url});
    } catch (e) {
        // clear memory on a tab open event error
        clearMemory();

        return false;
    }
};

export default openAsDataFn;
