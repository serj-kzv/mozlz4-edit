export interface Option {

    loadDefault(): Promise<any>;

    loadSaved(): Promise<any>;

    loadSavedAsTxt(): Promise<string>;

    load(): Promise<any>;

    loadAsTxt(): Promise<string>;

    resetDefault(): Promise<any>;

    resetDefaultAndGetAsTxt(): Promise<string>;

    save(payload): Promise<any>;

    saveTxt(payload: string): Promise<any>;

    saveTxtAndGetAsJson(payload: string): Promise<any>;

}
