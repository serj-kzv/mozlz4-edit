import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ModalService} from "../../../shared/module/modal/modal.service";
import {AddEngineModalComponent} from "./add-engine-modal/add-engine-modal.component";
import {OptionComponent} from "../option/option.component";

@Component({
    selector: 'app-panel',
    templateUrl: './panel.component.html',
    styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {

    public addEngineModalName = AddEngineModalComponent.componentName;
    public optionModalName = OptionComponent.componentName;

    @Output() openMozLz4File = new EventEmitter<any>();
    @Output() openTxtInNewTab = new EventEmitter();
    @Output() saveAsMozLz4File = new EventEmitter();
    @Output() saveAsMozLz4FileWithDialogue = new EventEmitter();
    @Output() saveAsJsonFile = new EventEmitter();
    @Output() saveAsJsonFileWithDialogue = new EventEmitter();
    @Output() formatJson = new EventEmitter();

    constructor(public modalService: ModalService) {
    }

    ngOnInit(): void {
    }

}
