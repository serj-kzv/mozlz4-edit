import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';

@Component({
    selector: 'app-add-engine-form',
    templateUrl: './add-engine-form.component.html',
    styleUrls: ['./add-engine-form.component.scss']
})
export class AddEngineFormComponent implements OnInit {
    @Input() engine;
    engineForm = this.fb.group({
        name: [''],
        url: [''],
        icon: [''],
        iconTxt: [''],
    });

    constructor(private fb: FormBuilder) {
    }

    ngOnInit(): void {
        console.log(this.engine)
        this.engineForm.patchValue(this.engine);
    }

    add() {
        console.log(this.engineForm.controls['name'].value)
    }
}
