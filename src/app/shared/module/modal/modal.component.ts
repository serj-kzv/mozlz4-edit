import {Component, EventEmitter, OnDestroy, Output} from '@angular/core';
import {ModalService} from "./modal.service";

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnDestroy {
    @Output() modalClosed = new EventEmitter();
    closed = false;

    constructor(public modalService: ModalService) {
    }

    ngOnDestroy(): void {
        if (!closed) {
            this.modalClosed.emit();
        }
    }
}
