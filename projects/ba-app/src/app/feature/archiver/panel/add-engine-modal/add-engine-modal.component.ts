import {Component, OnInit} from '@angular/core';
import {ModalService} from "../../../../shared/module/modal/modal.service";

@Component({
    selector: 'app-add-engine-modal',
    templateUrl: './add-engine-modal.component.html',
    styleUrls: ['./add-engine-modal.component.scss']
})
export class AddEngineModalComponent implements OnInit {

    public static componentName = 'app-add-engine-modal';
    engines: { types: { name?: string, engines: { name?: string, url?: string, icon?: string }[] }[] } = {types: []};

    constructor(public modalService: ModalService) {

    }

    ngOnInit(): void {
        console.log('init');
        this.init();
    }

    async init() {
        this.engines = await (await fetch('./assets/engines.json')).json();
        console.log(this.engines);
    }

    modalClosed() {
        console.log('modal closed');
    }

}
