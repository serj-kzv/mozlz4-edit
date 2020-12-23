import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {ModalService} from "./modal.service";

@Injectable({
  providedIn: 'root'
})
export class ModalRegistryService {
  constructor(public router: Router) {
    this.initEager();
    this.initLazy();
  }

  initEager(components = []): void {
    components.forEach(component => this.register(component));
  }

  register({path, component}): void {
    this.router.config.unshift({path, outlet: ModalService.eagerOutletName, component});
  }

  initLazy(loadChildren = []) {
    loadChildren.forEach(loadChildren => this.registerLazy(loadChildren));
  }

  registerLazy({path, loadChildren}): void {
    this.router.config.unshift({path, outlet: ModalService.lazyOutletName, loadChildren});
  }
}
