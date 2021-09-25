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
        return (await this.optionService.load())[Constants.LOCAL_STORAGE_ENGINE_KEY];
    }

    async loadAsTxt(): Promise<string> {
        return (await this.optionService.loadAsTxt())[Constants.LOCAL_STORAGE_ENGINE_KEY];
    }

    async resetDefault(): Promise<any> {
        const engines = (await this.optionService.loadDefault())[Constants.LOCAL_STORAGE_ENGINE_KEY];
        const config = (await this.optionService.load())[Constants.LOCAL_STORAGE_ENGINE_KEY] = engines;

        return (await this.optionService.save(config))[Constants.LOCAL_STORAGE_ENGINE_KEY];
    }

    async save(engines): Promise<any> {
        const config = (await this.optionService.load())[Constants.LOCAL_STORAGE_ENGINE_KEY] = engines;

        return (await this.optionService.save(config))[Constants.LOCAL_STORAGE_ENGINE_KEY];
    }

    async saveTxtAndGetAsJson(engines): Promise<any> {
        return await this.save(JSON.parse(engines));
    }

    async resetDefaultAndGetAsTxt(): Promise<string> {
        return (await this.optionService.resetDefaultAndGetAsTxt())[Constants.LOCAL_STORAGE_ENGINE_KEY];
    }

}
