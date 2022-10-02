browser.browserAction.onClicked.addListener(async () => browser.tabs.create({url: '/index.html'}));
