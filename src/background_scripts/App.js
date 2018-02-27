class App {
    constructor() {

    }

    run() {
        CONFIG.getAPI().browser.browserAPI.browserAction.onClicked.addListener(
            async tab => {
                CONFIG.getAPI().browser.browserAPI.tabs.create({
                    url : 'ui/page.htm'
                });
            }
        );
    }

}