import {Injectable} from '@angular/core';
import {Constants} from "../../util/Constants";
import {Option} from "./option";

@Injectable({
    providedIn: 'root'
})
export class OptionService implements Option {

    private storage = browser.storage.local;

    constructor() {
    }

    async loadDefault(): Promise<any> {
        return await (await fetch(Constants.DEFAULT_CONFIG_FILE_PATH)).json();
    }

    async loadSaved(): Promise<any> {
        return await this.storage.get(Constants.LOCAL_STORAGE_CONFIG_KEY);
    }

    async loadSavedAsTxt(): Promise<string> {
        return JSON.stringify(await this.loadSaved(), null, 4);
    }

    async load(): Promise<any> {
        const config = await this.loadSaved();

        if (Object.keys(config).length === 0) {
            await this.save(await this.loadDefault());

            return (await this.loadSaved())[Constants.LOCAL_STORAGE_CONFIG_KEY];
        }

        return config[Constants.LOCAL_STORAGE_CONFIG_KEY];
    }

    async loadAsTxt(): Promise<string> {
        return JSON.stringify(await this.load(), null, 4);
    }

    async resetDefault(): Promise<any> {
        await this.storage.remove(Constants.LOCAL_STORAGE_CONFIG_KEY);

        return await this.load();
    }

    async resetDefaultAndGetAsTxt(): Promise<string> {
        return JSON.stringify(await this.resetDefault(), null, 4);
    }

    async save(payload): Promise<any> {
        const name = Constants.LOCAL_STORAGE_CONFIG_KEY;

        await this.storage.set({name, payload});

        return await this.load();
    }

    async saveTxtAndGetAsJson(payload): Promise<any> {
        return await this.save(JSON.parse(payload));
    }

}
