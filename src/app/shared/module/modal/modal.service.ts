import {Injectable} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    public static eagerOutletName = 'modal';

    protected constructor(public router: Router) {
    }

    async show(name: string, relativeTo: ActivatedRoute | null = null): Promise<boolean> {
        await this.hide();

        const route = [{outlets: {}}];

        route[0].outlets[`${ModalService.eagerOutletName}`] = [name];

        return await this.router.navigate(route, {relativeTo});
    }

    hide(): Promise<boolean> {
        const route = [{outlets: {}}];

        route[0].outlets[`${ModalService.eagerOutletName}`] = null;

        return this.router.navigate(route);
    }
}
