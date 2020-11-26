import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ModalService} from "./modal.service";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Output() modalClosed = new EventEmitter();

  constructor(public modalService: ModalService) { }

  ngOnInit(): void {
  }

}
