class OptionApi {
    constructor() {
        this.CFG = OptionApi.cfg();
    }

    async readOptions() {
        const stored = await browser.storage.local.get(this.CFG.name);

        if (typeof stored.options !== 'undefined') {
            return stored.options;
        }
    }

    async saveOptions(name, data) {
        const options = await this.readOptions();

        options[name] = data;

        return await browser.storage.local.set({options});
    }

    async readEngineExamples() {
        const options = await this.readOptions();

        if (options !== undefined && typeof options.engineExamples !== 'undefined') {
            return options.engineExamples;
        }
    }

    async readDownloadType() {
        const options = await this.readOptions();

        if (options !== undefined && typeof options.downloadType !== 'undefined') {
            return options.downloadType;
        }
    }

    async saveEngineExamples(engineExamples) {
        return await this.saveOptions('engineExamples', engineExamples);
    }

    async saveDownloadType(downloadType) {
        return await this.saveOptions('downloadType', downloadType);
    }

    static cfg() {
        return Object.freeze({
            name: 'options'
        });
    }
}

const OPTION_API = new OptionApi();
export default OPTION_API;