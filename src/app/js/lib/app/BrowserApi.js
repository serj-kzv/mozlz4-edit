export default class BrowserApi {
    static getURL(url) {
        // to work as a html page
        if (typeof browser === 'undefined') {
            return url.substring(url.indexOf('/') + 1);
        }

        return browser.runtime.getURL(url);
    }
}