import {Injectable} from '@angular/core';
import {ModalRegistryService} from "../../shared/module/modal/modal-registry.service";
import {Router} from "@angular/router";
import {AddEngineModalComponent} from "../../feature/archiver/panel/add-engine-modal/add-engine-modal.component";
import {OptionComponent} from "../../feature/archiver/option/option.component";

@Injectable({
    providedIn: 'root'
})
export class InitService {

    constructor(public router: Router, public modalRegistryService: ModalRegistryService) {
    }

    init(): void {
        this.modalRegistryService.initEager([{
            path: AddEngineModalComponent.componentName,
            component: AddEngineModalComponent
        }]);
        this.modalRegistryService.initEager([{
            path: OptionComponent.componentName,
            component: OptionComponent
        }]);
    }
}
