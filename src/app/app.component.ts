import {Component, OnInit} from '@angular/core';
import {InitService} from "./core/service/init.service";

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
    constructor(public initService: InitService) {
        this.init();
    }

    init() {
        this.initService.init();
    }

    ngOnInit(): void {
    }
}
