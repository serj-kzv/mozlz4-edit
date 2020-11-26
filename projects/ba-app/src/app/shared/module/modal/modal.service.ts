import {Injectable} from '@angular/core';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  public static outletName = 'modal';

  protected constructor(public router: Router) {
  }

  async show(name: string): Promise<boolean> {
    await this.hide();
    const route = [{ outlets: {}}];
    route[0].outlets[`${ModalService.outletName}`] = [name];
    return await this.router.navigate(route);
  }

  hide(): Promise<boolean> {
    const route = [{ outlets: {}}];
    route[0].outlets[`${ModalService.outletName}`] = null;
    return this.router.navigate(route);
  }
}
