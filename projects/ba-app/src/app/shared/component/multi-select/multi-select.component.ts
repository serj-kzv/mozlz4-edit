import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Entry} from "./Entry";

@Component({
    selector: 'app-multi-select',
    templateUrl: './multi-select.component.html',
    styleUrls: ['./multi-select.component.scss']
})
export class MultiSelectComponent implements OnInit {
    @Input() sourceEntries: Entry[] = [];
    @Input() targetEntries: Entry[] = [];
    @Output() sourceSelected = new EventEmitter<Entry[]>();
    @Output() targetSelected = new EventEmitter<Entry[]>();
    @Input() searchQuery = '';
    searchPredicate = (entry: Entry) => !this.searchQuery
        || this.searchQuery.length === 0
        || entry.name.toLocaleLowerCase().indexOf(this.searchQuery.toLocaleLowerCase()) > -1;

    constructor() {
    }

    ngOnInit(): void {
        console.log(this.sourceEntries);
    }

    sourceSelect() {
        const selects = Array.from(this.sourceSelected as any);
        const lastSelect = selects[selects.length - 1] as Entry;

        lastSelect.selected = true;
        this.targetEntries = [...this.targetEntries, lastSelect] as any[];
        this.targetSelected.emit(this.targetEntries);
    }

    targetSelect() {
        console.log('test');
        const selects = Array.from(this.targetSelected as any);

        if (selects.length > 0) {
            const lastSelect = selects[selects.length - 1] as Entry;

            for (const entry of this.sourceEntries) {
                if (name !== lastSelect.name) {
                    entry.selected = false;
                    // break;
                }
            }

        }
    }
}
