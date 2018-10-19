import TrimHtmlWhiteSpace from '../lib/app/TrimHtmlWhiteSpace.js';
import AppCfg from './parts/AppCfg.js';
import AppEditor from './parts/AppEditor.js';
import AppAddEngine from './parts/AppAddEngine.js';

export const APP = { ctx: null };
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
        await this.runOnDOMloadend();
    }

    runOnDOMloadend() {
        return new Promise(resolve => document.addEventListener("DOMContentLoaded", async () => {
            await this.init();
            resolve(true);
        }));
    }

    async init() {
        this.appCfg = await AppCfg.build();
        // this.appCfgEngine = await AppCfgEngine.build();
        // this.appCfgDownload = new AppCfgDownload();
        this.appEditor = await AppEditor.build();
        this.appAddEngine = await AppAddEngine.build();
        TrimHtmlWhiteSpace.trim(document.body);
    }
}