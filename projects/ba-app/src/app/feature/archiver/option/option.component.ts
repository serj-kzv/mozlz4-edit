import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss']
})
export class OptionComponent implements OnInit {
  public static componentName = 'option-modal';
  engines: any;

  constructor() { }

  ngOnInit(): void {
  }

  test() {

  }
}
