import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class EngineService {
    engines = new Subject<{ engines: [] }>();

    constructor() {
        this.engines.subscribe(engines => {

        });
    }

    add(engine) {
        console.log('engines', this.engines);
        console.log('engine', engine);
    }
}
