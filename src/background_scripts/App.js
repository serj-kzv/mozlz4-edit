class App {
    constructor() {

    }

    run() {
        browserAPI.browserAction.onClicked.addListener(
            async tab => {
                browserAPI.tabs.create({
                    url : 'ui/app.htm'
                });
            }
        );
    }

}