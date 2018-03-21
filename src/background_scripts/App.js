class App {
    run() {
        this.initAddonBtn();
    }

    initAddonBtn() {
        browser.browserAction.onClicked.addListener(
            async tab => {
                browser.tabs.create({
                    url: 'app/app.htm'
                });
            }
        );
    }
}