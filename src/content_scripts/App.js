class App {
    constructor() {
        this.onMessageListener = async (requestMsg, sender, sendResponse) => {

        };
    }

    run() {
        const that = this;

        browserAPI.runtime.onMessage.addListener(that.onMessageListener);
    }
}