import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

    @Input() engines: string = '';
    @Output() enginesChange = new EventEmitter<string>();
    placeholder = `
        Help:
        1. Saving with dialogue can invoke a little memory leak (the leak will be eliminated after the page will be closed).
        2. Check default Download directory if you use usual saving without dialogue.
        3. Open a mozlz4 file with search engines before to try to add search engine.
    `;

    constructor() {
    }

    ngOnInit(): void {
    }
}
