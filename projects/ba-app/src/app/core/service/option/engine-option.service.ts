import {Injectable} from '@angular/core';
import {Constants} from "../../../util/Constants";
import {OptionService} from "./option.service";
import {Option} from "./option";

@Injectable({
    providedIn: 'root'
})
export class EngineOptionService implements Option {

    constructor(public optionService: OptionService) {
    }

    async loadDefault(): Promise<any> {
        return (await this.optionService.loadDefault())[Constants.LOCAL_STORAGE_ENGINE_KEY];
    }

    async loadSaved(): Promise<any> {
        return (await this.optionService.loadSaved())[Constants.LOCAL_STORAGE_ENGINE_KEY];
    }

    async loadSavedAsTxt(): Promise<string> {
        return JSON.stringify(await this.loadSaved(), null, 4);
    }

    async load(): Promise<any> {
        console.log('load config in engines', await this.optionService.load());
        return (await this.optionService.load())[Constants.LOCAL_STORAGE_ENGINE_KEY];
    }

    async loadAsTxt(): Promise<string> {
        console.log('loadAsTxt ', await this.load());
        return JSON.stringify(await this.load(), null, 4);
    }

    async resetDefault(): Promise<any> {
        const engines = (await this.optionService.loadDefault())[Constants.LOCAL_STORAGE_ENGINE_KEY];
        const config = (await this.optionService.load())[Constants.LOCAL_STORAGE_ENGINE_KEY] = engines;

        return (await this.optionService.save(config))[Constants.LOCAL_STORAGE_ENGINE_KEY];
    }

    async save(engines): Promise<any> {
        const config = (await this.optionService.load());

        config[Constants.LOCAL_STORAGE_ENGINE_KEY] = engines;
        console.log('new engines in config load', await this.optionService.load());
        console.log('new engines in config', config);
        console.log('saved new engines in config', await this.optionService.save(config));

        return (await this.optionService.save(config))[Constants.LOCAL_STORAGE_ENGINE_KEY];
    }

    async saveTxt(payload: string): Promise<any> {
        return await this.save(JSON.parse(payload));
    }

    async saveTxtAndGetAsJson(engines: string): Promise<any> {
        return JSON.stringify(await this.saveTxt(engines), null, 4);
    }

    async resetDefaultAndGetAsTxt(): Promise<string> {
        return JSON.stringify(await this.resetDefault(), null, 4);
    }

}
