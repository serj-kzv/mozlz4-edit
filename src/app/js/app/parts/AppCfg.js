import WEB_EXT_API from '../../lib/app/WebExtApi.js';

export default class AppCfg {
    constructor() {
        this.downloadType = null;
        this.engineExamples = null;
    }

    static async build() {
        const appCfg = new AppCfg();

        await appCfg.init();

        return appCfg;
    }

    async init() {
        await this.initCfgEngineList();
        this.setDefaultDownloadType();
    }

    async initEngineExamples() {
        return this.engineExamples = await (await fetch(
            WEB_EXT_API.getURL('app/resources/engines.json')
        )).json();
    }

    async initCfgEngineList() {
        if (WEB_EXT_API.isWebExt) {
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

        await browser.storage.local.set({ options: { engineExamples } });
    }

    setDefaultDownloadType() {
        this.downloadType = WEB_EXT_API.isWebExt ? 'webExt' : 'browserLink';
        console.log(this.downloadType)
        // if (WEB_EXT_API.isWebExt) {
        //     for (const switcher of this.downloadTypeSwitcher) {
        //         switch (true) {
        //             case switcher.value === 'browserLink': {
        //                 switcher.click();
        //                 break;
        //             }
        //             case switcher.value === 'webExt': {
        //                 switcher.disabled = true;
        //                 break;
        //             }
        //         }
        //     }
        // }
    }

    getEngineType(typeName) {
        return this.engineExamples.types.find(t => t.name === typeName);
    }

    getEngine(typeName, name) {
        const engineType = this.getEngineType(typeName);

        if (engineType !== undefined) {
            return engineType.engines.find(e => e.name === name);
        }
    }
}