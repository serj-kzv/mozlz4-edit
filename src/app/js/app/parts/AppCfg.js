import AppCfgEngine from './AppCfgEngine.js';

export default class AppCfg {
    constructor() {
        this.appCfgEngine = null;
    }

    static async build() {
        const appCfg = new AppCfg();

        await appCfg.init();

        return appCfg;
    }

    async init() {
        this.appCfgEngine = await AppCfgEngine.build();
    }

    getEngines() {
        return this.appCfgEngine.engineExamples;
    }

    getEngineType(typeName) {
        return this.appCfgEngine.getEngineType(typeName);
    }
}