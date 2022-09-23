import {Component, OnInit} from '@angular/core';
import Type from "../../../../model/Type";
import {EngineOptionService} from "../../../../core/service/option/engine-option.service";

@Component({
    selector: 'app-add-engine-modal',
    templateUrl: './add-engine-modal.component.html',
    styleUrls: ['./add-engine-modal.component.scss']
})
export class AddEngineModalComponent implements OnInit {
    public static readonly componentName = 'app-add-engine-modal';
    engines: { types: Type[] } = {types: []};

    constructor(public engineOptionService: EngineOptionService) {
    }

    ngOnInit(): void {
        this.init();
    }

    async init() {
        this.engines = await this.engineOptionService.load();
    }
}
