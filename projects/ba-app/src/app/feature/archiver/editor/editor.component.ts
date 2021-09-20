import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EngineService} from "../../../core/service/engine.service";

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

    @Input() engines: string = '';
    @Output() enginesChange = new EventEmitter<string>();

    constructor(public engineService: EngineService) {
    }

    ngOnInit(): void {
    }
}
