class App {
    constructor() {
    }

    run() {
        this.initAddonBtn();
    }

    initAddonBtn() {
        browserAPI.browserAction.onClicked.addListener(
            async tab => {
                browserAPI.tabs.create({
                    url: 'ui/app.htm'
                });
            }
        );
    }

}