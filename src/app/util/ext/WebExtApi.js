/**
 * Web extensions API singleton
 * // TODO: check if it is real singleton
 */
class WebExtApi {
    constructor() {
        this.isWebExt = typeof browser !== 'undefined';
    }

    getURL(url) {
        // to work as a html page
        if (this.isWebExt) {
            return browser.runtime.getURL(url);
        }

        return url.substring(url.indexOf('/') + 1);
    }
}

const WEB_EXT_API = new WebExtApi();

export default WEB_EXT_API;