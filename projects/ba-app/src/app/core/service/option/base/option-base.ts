import {OptionService} from "../option.service";
import {Option} from "./option";

export abstract class OptionBase implements Option {
    protected constructor(private readonly name: string,
                          private readonly optionService: OptionService) {
    }

    async loadDefault(): Promise<any> {
        return (await this.optionService.loadDefault())[this.name];
    }

    async loadSaved(): Promise<any> {
        return (await this.optionService.loadSaved())[this.name];
    }

    async loadSavedAsTxt(): Promise<string> {
        return JSON.stringify(await this.loadSaved(), null, 4);
    }

    async load(): Promise<any> {
        console.log('load config in engines', await this.optionService.load());
        return (await this.optionService.load())[this.name];
    }

    async loadAsTxt(): Promise<string> {
        console.log('loadAsTxt ', await this.load());
        return JSON.stringify(await this.load(), null, 4);
    }

    async resetDefault(): Promise<any> {
        const payload = (await this.optionService.loadDefault())[this.name];
        const config = (await this.optionService.load())[this.name] = payload;

        return (await this.optionService.save(config))[this.name];
    }

    async save(payload): Promise<any> {
        const config = (await this.optionService.load());

        config[this.name] = payload;
        console.log('new engines in config load', await this.optionService.load());
        console.log('new engines in config', config);
        console.log('saved new engines in config', await this.optionService.save(config));

        return (await this.optionService.save(config))[this.name];
    }

    async saveTxt(payload: string): Promise<any> {
        return await this.save(JSON.parse(payload));
    }

    async saveTxtAndGetAsJson(payload: string): Promise<any> {
        return JSON.stringify(await this.saveTxt(payload), null, 4);
    }

    async resetDefaultAndGetAsTxt(): Promise<string> {
        return JSON.stringify(await this.resetDefault(), null, 4);
    }
}