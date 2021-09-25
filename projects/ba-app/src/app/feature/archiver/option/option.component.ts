import {Component, OnInit} from '@angular/core';
import {EngineOptionService} from "../../../core/service/engine-option.service";
import saveAsDataFn from '../../../util/ext/file/saveAsDataFn.js';
import saveAsDataLinkFn from '../../../util/ext/file/saveAsDataLinkFn.js';
import readFileAsTxtFn from '../../../util/file/readFileAsTxtFn.js';

@Component({
    selector: 'app-option',
    templateUrl: './option.component.html',
    styleUrls: ['./option.component.scss']
})
export class OptionComponent implements OnInit {
    public optionReadonly = false;
    public static componentName = 'option-modal';
    engines = '{}';

    constructor(public engineService: EngineOptionService) {
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
        this.engines = await this.engineService.loadAsTxt();
    }

    async save() {
        this.lockTextarea();
        await this.engineService.saveTxtAndGetAsJson(this.engines);
        this.unlockTextarea();
    }

    async reset() {
        this.lockTextarea();
        this.engines = await this.engineService.resetDefault();
        this.unlockTextarea();
    }

    formatJson() {
        this.lockTextarea();
        try {
            this.engines = JSON.stringify(JSON.parse(this.engines), null, 4);
        } catch (e) {
            alert('Error. JSON is invalid!');
            this.unlockTextarea();
        }
        this.unlockTextarea();
    }

    async exportAsJson() {
        this.lockTextarea();
        let fileName = 'engine.list';

        if (fileName.length === 0) {
            fileName = 'file.json';
        } else if (!fileName.endsWith('.json')) {
            fileName = `${fileName}.json`;
        }

        try {
            await saveAsDataFn(this.engines, 'octet/stream', false, fileName);
        } catch (e) {
            alert(`An error! Possibly the file '${fileName}.json' is busy. Close programs that can use the file and try again.`);
            this.unlockTextarea();
        }
        this.unlockTextarea();
    }

    async importByFile($event) {
        this.lockTextarea();
        this.engines = 'Loading... Wait.';

        const sourceFile = $event.files[0];

        this.engines = await readFileAsTxtFn(sourceFile);
        this.unlockTextarea();
    }

    async importByUrl() {
        this.lockTextarea();

        const {defaultEngineListUrl: defaultUrl} = await this.engineService.load();
        const url = window.prompt('Enter an URL to a JSON file that contains an engine list.', defaultUrl);

        if (url == null) {
            return;
        }

        let txt;

        try {
            txt = await (await fetch(url)).text();

            try {
                const json = JSON.parse(txt);

                await this.engineService.save(json);
                this.engines = await this.engineService.loadSavedAsTxt();
            } catch (e) {
                alert('Error. JSON is invalid.');
                this.unlockTextarea();
            }
        } catch (e) {
            alert('Error. Something wrong with an URL!');
            this.unlockTextarea();
        }
        this.unlockTextarea();
    }

    async exportAsJsonWithDialogue() {
        this.lockTextarea();
        let fileName = 'engine.list';

        if (fileName.length === 0) {
            fileName = 'file.json';
        } else if (!fileName.endsWith('.json')) {
            fileName = `${fileName}.json`;
        }

        try {
            await saveAsDataLinkFn(this.engines, 'octet/stream', false, fileName);
        } catch (e) {
            alert(`An error! Possibly the file '${fileName}.json' is busy. Close programs that can use the file and try again.`);
            this.unlockTextarea();
        }
        this.unlockTextarea();
    }
}
