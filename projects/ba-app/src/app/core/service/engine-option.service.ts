import {Injectable} from '@angular/core';
import {Constants} from "../../util/Constants";

@Injectable({
    providedIn: 'root'
})
export class EngineOptionService {

    private storage = browser.storage.local;

    constructor() {
    }

    async loadDefault() {
        return await (await fetch(Constants.DEFAULT_ENGINES_FILE_PATH)).json();
    }

    async loadSaved() {
        return await this.storage.get(Constants.LOCAL_STORAGE_ENGINE_KEY);
    }

    async loadSavedAsTxt() {
        return JSON.stringify(await this.storage.get(Constants.LOCAL_STORAGE_ENGINE_KEY), null, 4);
    }

    async load() {
        const engines = await this.loadSaved();

        if (Object.keys(engines).length === 0) {
            await this.save(await this.loadDefault());

            return (await this.loadSaved())[Constants.LOCAL_STORAGE_ENGINE_KEY];
        }

        return engines[Constants.LOCAL_STORAGE_ENGINE_KEY];
    }

    async loadAsTxt() {
        return JSON.stringify(await this.load(), null, 4);
    }

    async resetDefault() {
        await this.storage.remove(Constants.LOCAL_STORAGE_ENGINE_KEY);

        return await this.loadAsTxt();
    }

    async save(engines) {
        const name = Constants.LOCAL_STORAGE_ENGINE_KEY;

        return await this.storage.set({name, engines});
    }

    async saveTxtAsJson(engines) {
        return await this.save(JSON.parse(engines));
    }
}
