import {Injectable} from '@angular/core';
import {Constants} from "../../../util/Constants";
import {Option} from "./base/option";

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
        const option = await this.storage.get(Constants.LOCAL_STORAGE_CONFIG_KEY);
        const config = option[Constants.LOCAL_STORAGE_CONFIG_KEY];

        if (config) {
            return config;
        }

        return option;
    }

    async loadSavedAsTxt(): Promise<string> {
        return JSON.stringify(await this.loadSaved(), null, 4);
    }

    async load(): Promise<any> {
        const config = await this.loadSaved();

        if (Object.keys(config).length === 0) {
            return (await this.save(await this.loadDefault()));
        }

        return config;
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

    async save(payload: any): Promise<any> {
        const name = Constants.LOCAL_STORAGE_CONFIG_KEY;
        const config = Object.create(null);

        config[name] = payload;
        await this.storage.set(config);

        return await this.loadSaved();
    }

    async saveTxt(payload: string): Promise<any> {
        return await this.save(JSON.parse(payload));
    }

    async saveTxtAndGetAsJson(payload: string): Promise<any> {
        return JSON.stringify(await this.saveTxt(payload), null, 4);
    }

}
