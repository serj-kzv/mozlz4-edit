import {NgModule} from '@angular/core';
import {ModalComponent} from './modal.component';
import {CommonModule} from "@angular/common";
import {TitleComponent} from './title/title.component';
import {HeaderComponent} from './header/header.component';
import {ContentComponent} from './content/content.component';
import {FooterComponent} from './footer/footer.component';


@NgModule({
  declarations: [ModalComponent, TitleComponent, HeaderComponent, ContentComponent, FooterComponent],
  imports: [
    CommonModule
  ],
  exports: [
    ModalComponent,
    TitleComponent,
    HeaderComponent,
    ContentComponent,
    FooterComponent,
  ],
})
export class ModalModule { }
