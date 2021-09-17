import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {ModalService} from "./modal.service";

@Injectable({
  providedIn: 'root'
})
export class ModalRegistryService {
  constructor(public router: Router) {
    this.initEager();
  }

  initEager(components = []): void {
    components.forEach(component => this.register(component));
  }

  register({path, component}): void {
    this.router.config.unshift({path, outlet: ModalService.eagerOutletName, component});
  }

}
