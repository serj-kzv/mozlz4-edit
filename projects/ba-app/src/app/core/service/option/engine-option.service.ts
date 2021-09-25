import {Injectable} from '@angular/core';
import {Constants} from "../../../util/Constants";
import {OptionService} from "./option.service";
import {OptionBase} from "./base/option-base";

@Injectable({
    providedIn: 'root'
})
export class EngineOptionService extends OptionBase {

    constructor(optionService: OptionService) {
        super(Constants.LOCAL_STORAGE_ENGINE_KEY, optionService);
    }

}
