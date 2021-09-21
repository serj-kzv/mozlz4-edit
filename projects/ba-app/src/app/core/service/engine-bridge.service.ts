import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class EngineBridgeService {
    public readonly addEngine$: Subject<any> = new Subject();
}
