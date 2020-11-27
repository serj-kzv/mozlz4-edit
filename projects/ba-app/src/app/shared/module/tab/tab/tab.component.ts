import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit {

  @Input() active: boolean = false;
  @Input() name: string = '';
  @ViewChild('templateRef') public templateRef: TemplateRef<any>;

  constructor() { }

  ngOnInit(): void {
  }

}
