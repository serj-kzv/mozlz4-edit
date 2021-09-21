import {Component, OnInit} from '@angular/core';
import Type from "../../../../model/Type";

@Component({
    selector: 'app-add-engine-modal',
    templateUrl: './add-engine-modal.component.html',
    styleUrls: ['./add-engine-modal.component.scss']
})
export class AddEngineModalComponent implements OnInit {
    public static readonly componentName = 'app-add-engine-modal';
    engines: { types: Type[] } = {types: []};

    constructor() {
    }

    ngOnInit(): void {
        console.log('init');
        this.init();
    }

    async init() {
        this.engines = await (await fetch('./assets/engines.json')).json();
    }

    modalClosed() {
        console.log('modal closed');
    }

}
