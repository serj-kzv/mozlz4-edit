import {Component, OnInit} from '@angular/core';
import {EngineService} from "../../../core/service/engine.service";

@Component({
    selector: 'app-option',
    templateUrl: './option.component.html',
    styleUrls: ['./option.component.scss']
})
export class OptionComponent implements OnInit {
    public optionReadonly = false;
    public static componentName = 'option-modal';
    engines = '{}';

    constructor(public engineService: EngineService) {
    }

    lockTextarea() {
        this.optionReadonly = true;
    }

    unlockTextarea() {
        this.optionReadonly = false;
    }

    ngOnInit(): void {
        this.init();
    }

    async init() {
        console.log('OptionComponent start')
        this.engines = await this.engineService.loadAsTxt();
        console.log('OptionComponent', this.engines)
    }

    async save() {
        this.lockTextarea();
        await this.engineService.saveTxtAsJson(this.engines);
        this.unlockTextarea();
    }

    async reset() {
        this.lockTextarea();
        this.engines = await this.engineService.resetDefault();
        this.unlockTextarea();
    }

    formatJson() {
        try {
            this.engines = JSON.stringify(JSON.parse(this.engines), null, 4);
        } catch (e) {
            alert('Error. JSON is invalid!');
        }
    }

    export() {

    }

    importByFile() {

    }

    importByUrl() {

    }
}
