export interface Option {

    loadDefault(): Promise<any>;

    loadSaved(): Promise<any>;

    loadSavedAsTxt(): Promise<string>;

    load(): Promise<any>;

    loadAsTxt(): Promise<string>;

    resetDefault(): Promise<any>;

    resetDefaultAndGetAsTxt(): Promise<string>;

    save(payload): Promise<any>;

    saveTxtAndGetAsJson(payload): Promise<any>;

}
