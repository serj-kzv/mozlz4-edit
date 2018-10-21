class OptionApi {
    async readOptions() {
        const stored = await browser.storage.local.get('options');

        if (typeof stored.options !== 'undefined') {
            return stored.options;
        }

        return await this.saveOptions({});
    }

    async saveOptions(options) {
        await browser.storage.local.set({options});

        return options;
    }

    async saveOptionsData(name, data) {
        const options = await this.readOptions();

        if (options !== undefined) {
            options[name] = data;

            return await browser.storage.local.set({options});
        }
    }

    async readOptionsData(name) {
        const options = await this.readOptions();

        if (options !== undefined) {
            const cfg = options[name];

            if (typeof cfg !== 'undefined') {
                return cfg;
            }
        }
    }

    async readEngineExamples() {
        return await this.readOptionsData('engineExamples');
    }

    async readDownloadType() {
        return await this.readOptionsData('downloadType');
    }

    async saveEngineExamples(engineExamples) {
        return await this.saveOptionsData('engineExamples', engineExamples);
    }

    async saveDownloadType(downloadType) {
        return await this.saveOptionsData('downloadType', downloadType);
    }

    async clear() {
        return await browser.storage.local.clear();
    }
}

const OPTION_API = new OptionApi();
export default OPTION_API;