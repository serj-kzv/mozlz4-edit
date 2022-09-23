import {Component, Input, TemplateRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-tab-content',
  templateUrl: './tab-content.component.html',
  styleUrls: ['./tab-content.component.scss']
})
export class TabContentComponent {
  @Input() active: boolean = false;
  @Input() name: string = '';
  @ViewChild('templateRef') public templateRef!: TemplateRef<any>;
}
