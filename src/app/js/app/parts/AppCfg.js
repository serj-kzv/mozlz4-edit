import WEB_EXT_API from '../../lib/app/WebExtApi.js';

export default class AppCfg {
    constructor() {
    }

    static async build() {
        const appCfg = new AppCfg();

        await appCfg.init();

        return appCfg;
    }

    async init() {
        await this.initCfgEngineList();
    }

    async initEngineExamples() {
        const url = WEB_EXT_API.getURL('app/resources/engines.json');

        return this.engineExamples = await (await fetch(url)).json();
    }

    async initCfgEngineList() {
        if (typeof browser !== 'undefined') {
            try {
                const stored = await browser.storage.local.get('options');

                if (typeof stored.options !== 'undefined') {
                    this.engineExamples = stored.options.engineExamples;
                } else {
                    await this.loadAndSaveDefaultEngineList();
                }
            } catch (e) {
                await this.loadAndSaveDefaultEngineList();
            }
        } else {
            await this.initEngineExamples();
        }
    }

    async loadAndSaveDefaultEngineList() {
        await this.initEngineExamples();

        const engineExamples = this.engineExamples;

        await browser.storage.local.set({options: {engineExamples}});
    }
}