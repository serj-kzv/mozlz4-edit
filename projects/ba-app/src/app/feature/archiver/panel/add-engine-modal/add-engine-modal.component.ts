import {Component, OnInit} from '@angular/core';
import {ModalService} from "../../../../shared/module/modal/modal.service";
import Type from "../../../../model/Type";

@Component({
    selector: 'app-add-engine-modal',
    templateUrl: './add-engine-modal.component.html',
    styleUrls: ['./add-engine-modal.component.scss']
})
export class AddEngineModalComponent implements OnInit {

    public static componentName = 'app-add-engine-modal';
    engines: { types: Type[] } = {types: []};

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
