import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Entry} from "./Entry";

@Component({
    selector: 'app-multi-select',
    templateUrl: './multi-select.component.html',
    styleUrls: ['./multi-select.component.scss']
})
export class MultiSelectComponent implements OnInit {

    @Input() entries: Entry[] = [];
    @Output() selected = new EventEmitter<[]>();

    constructor() {
    }

    ngOnInit(): void {
    }

    select($event) {
        console.log(this.selected)
    }
}
