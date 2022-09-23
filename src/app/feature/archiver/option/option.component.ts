import {Component, OnInit} from '@angular/core';
import {EngineOptionService} from "../../../core/service/option/engine-option.service";
import saveAsDataFn from '../../../util/ext/file/saveAsDataFn.js';
import saveAsDataLinkFn from '../../../util/ext/file/saveAsDataLinkFn.js';
import readFileAsTxtFn from '../../../util/file/readFileAsTxtFn.js';
import openAsJsonFn from '../../../util/ext/file/openAsJsonFn.js';
import {OptionService} from "../../../core/service/option/option.service";

@Component({
    selector: 'app-option',
    templateUrl: './option.component.html',
    styleUrls: ['./option.component.scss']
})
export class OptionComponent implements OnInit {
    public optionReadonly = false;
    public static componentName = 'option-modal';
    engines = '{}';

    constructor(public optionService: OptionService,
                public engineOptionService: EngineOptionService) {
    }

    ngOnInit(): void {
        this.init();
    }

    lockTextarea() {
        this.optionReadonly = true;
    }

    unlockTextarea() {
        this.optionReadonly = false;
    }

    async init() {
        this.engines = await this.engineOptionService.loadAsTxt();
    }

    async save() {
        this.lockTextarea();
        await this.engineOptionService.saveTxtAndGetAsJson(this.engines);
        this.unlockTextarea();
    }

    async reset() {
        this.lockTextarea();
        await this.optionService.resetDefault();
        this.engines = await this.engineOptionService.loadAsTxt();
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

        const {defaultEngineListUrl: defaultUrl} = await this.engineOptionService.load();
        const url = window.prompt('Enter an URL to a JSON file that contains an engine list.', defaultUrl);

        if (url == null) {
            return;
        }

        let txt;

        try {
            txt = await (await fetch(url)).text();

            try {
                const json = JSON.parse(txt);

                await this.engineOptionService.save(json);
                this.engines = await this.engineOptionService.loadSavedAsTxt();
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

    openInNewTab() {
        openAsJsonFn(this.engines);
    }
}
