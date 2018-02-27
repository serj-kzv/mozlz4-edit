// TODO: Rewrite this class as the Singleton pattern
class Config {

    constructor() {
        this.DEFAULT_CONFIG = null;
        this.CONFIG = null;

        this.init();
    }

    init() {
        this.initDefaultConfig();
        this.initConfig();
    }

    initDefaultConfig() {
        this.DEFAULT_CONFIG = {
            browser: {
                chrome: {
                    resourceTypes: [
                        'main_frame',
                        'sub_frame',
                        'stylesheet',
                        'script',
                        'image',
                        'font',
                        'object',
                        'xmlhttprequest',
                        'ping',
                        'csp_report',
                        'media',
                        'websocket',
                        'other',
                    ]
                },
                firefox: {
                    resourceTypes: [
                        'main_frame',
                        'sub_frame',
                        'stylesheet',
                        'script',
                        'image',
                        'object',
                        'xmlhttprequest',
                        'xbl',
                        'xslt',
                        'ping',
                        'beacon',
                        'xml_dtd',
                        'font',
                        'media',
                        'websocket',
                        'csp_report',
                        'imageset',
                        'web_manifest',
                        'other',
                    ]
                }
            },
            common: {
                debug: true,
                allowedCrossOriginProtocols: [
                    'http',
                    'https',
                    'ftp',
                    'file',
                    'chrome-extension'
                ],
                request: {
                    methods: [
                        'GET',
                        'HEAD',
                        'POST',
                        'PUT',
                        'DELETE',
                        'CONNECT',
                        'OPTIONS',
                        'TRACE',
                        'PATCH',
                    ]
                },
                saveHeaderNames: [
                    'Content-Type',

                    // Referer is Forbiden by browser policy
                    // 'Referer'
                ],
                savePageProtocols: [
                    'http',
                    'https',
                    'ftp',
                    'ftps'
                ]
            }
        };
    }

    initConfig() {
        this.CONFIG = {};
        switch (true) {
            case typeof browser !== 'undefined':
                {
                    // DEFAULT_CONFIG
                    this.DEFAULT_CONFIG.browser.firefox.browserAPI = browser;

                    // CONFIG
                    this.CONFIG.browser = this.DEFAULT_CONFIG.browser.firefox;
                    this.CONFIG.common = this.DEFAULT_CONFIG.common;

                    break;
                }
            case typeof chrome !== 'undefined':
                {
                    // DEFAULT_CONFIG
                    this.DEFAULT_CONFIG.browser.chrome.browserAPI = chrome;

                    // CONFIG
                    this.CONFIG.browser = this.DEFAULT_CONFIG.browser.chrome;
                    this.CONFIG.common = this.DEFAULT_CONFIG.common;

                    break;
                }
            default:
                {
                    console.log('Error. browser API does not exist.');
                }
        }
    }

    getAPI() {
        return this.CONFIG;
    }
}

const CONFIG = new Config();