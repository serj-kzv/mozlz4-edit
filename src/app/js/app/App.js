import TrimHtmlWhiteSpace from '../lib/app/TrimHtmlWhiteSpace.js';
import AppCfg from './parts/AppCfg.js';
import AppEditor from './parts/AppEditor.js';

export const APP = {ctx: null};
export default class App {
    constructor() {
        this.appCfgEngine = null;
        this.appCfgDownload = null;
        this.appCfg = null;
        this.appAddEngine = null;
        this.appEditor = null;
        APP.ctx = this;
    }

    async run() {
        this.runOnDOMloadend();
    }

    runOnDOMloadend() {
        document.addEventListener("DOMContentLoaded", () => this.init());
    }

    async init() {
        this.appCfg = await AppCfg.build();
        // this.appCfgEngine = await AppCfgEngine.build();
        // this.appCfgDownload = new AppCfgDownload();
        // this.appAddEngine = await AppAddEngine.build();
        this.appEditor = await AppEditor.build();
        TrimHtmlWhiteSpace.trim(document.body);
    }
}