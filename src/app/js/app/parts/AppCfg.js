import OPTION_API from '../../lib/app/OptionApi.js';
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
        await this.initDownloadType();
        await this.initCfgTmpl();
        this.initFullCfgResetBtn();
    }

    async initEngineExamples() {
        return this.engineExamples = await (await fetch(
            WEB_EXT_API.getURL('app/resources/engines.json')
        )).json();
    }

    async initCfgEngineList() {
        if (WEB_EXT_API.isWebExt) {
            try {
                const engineExamples = await OPTION_API.readEngineExamples();

                if (engineExamples !== undefined) {
                    this.engineExamples = engineExamples;
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

        await OPTION_API.saveEngineExamples(engineExamples);
    }

    async initDownloadType() {
        if (WEB_EXT_API.isWebExt) {
            const downloadType = await OPTION_API.readDownloadType();

            if (downloadType === undefined) {
                await OPTION_API.saveDownloadType(this.downloadType = 'webExt');
            } else {
                this.downloadType = downloadType;
            }
        } else {
            this.downloadType = 'browserLink';
        }
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

    async initCfgTmpl() {
        document.querySelector('#cfgContainer').innerHTML = await (
            await fetch(WEB_EXT_API.getURL('app/cfg.htm'))
        ).text();
    }

    initFullCfgResetBtn() {
        const fullCfgResetBtn = document.querySelector('#fullCfgResetBtn');

        if (WEB_EXT_API.isWebExt) {
            fullCfgResetBtn.addEventListener('click', async () => {
                await OPTION_API.clear();
                document.location.replace(location.href);
            });
        } else {
            fullCfgResetBtn.disabled = true;
        }
    }
}