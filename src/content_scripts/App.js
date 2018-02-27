class App {
    constructor() {
        this.onMessageListener = async (requestMsg, sender, sendResponse) => {

        };
    }

    run() {
        const that = this;

        CONFIG.getAPI().browser.browserAPI.runtime.onMessage.addListener(that.onMessageListener);
    }
}