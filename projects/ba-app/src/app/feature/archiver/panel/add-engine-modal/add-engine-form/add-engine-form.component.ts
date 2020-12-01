import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import readFileAsBase64Fn from '../../../../../util/file/readFileAsBase64Fn.js'
import IconUtil from '../../../../../util/IconUtil.js'
import SearchEngineUtil from '../../../../../util/app/SearchEngineUtil.js'
import {DomSanitizer} from "@angular/platform-browser";

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

    constructor(private fb: FormBuilder, public domSanitizer: DomSanitizer) {
    }

    ngOnInit(): void {
        this.engineForm.patchValue(this.engine);
        this.engineForm.controls['iconTxt'].valueChanges.subscribe(async value => {
            console.log(value);
            const icon = await readFileAsBase64Fn(new Blob(
                [IconUtil.txtToSvg(value, 23, 23)],
                {type: 'image/svg+xml'}
            ));
            this.engineForm.patchValue({icon});
        });
    }

    add() {
        console.log(this.engineForm.controls['name'].value)
    }

    async pickIcon(target) {
        const icon = await readFileAsBase64Fn(target.files[0]);

        this.engineForm.patchValue({icon, iconTxt: ''});
    }
}
