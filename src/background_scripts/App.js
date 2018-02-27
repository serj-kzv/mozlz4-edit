class App {
    constructor() {

    }

    run() {
        CONFIG.getAPI().browser.browserAPI.browserAction.onClicked.addListener(
            async tab => {
                console.log('test');
                console.log(CONFIG.getAPI().browser.browserAPI);
                CONFIG.getAPI().browser.browserAPI.tabs.create({
                    url : 'ui/page.htm'
                });
            }
        );
    }

}