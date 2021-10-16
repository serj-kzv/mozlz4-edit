import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import readFileAsBase64Fn from '../../../../../util/file/readFileAsBase64Fn.js'
import IconUtil from '../../../../../util/IconUtil.js'
import SearchEngineUtil from '../../../../../util/app/SearchEngineUtil.js'
import {DomSanitizer} from "@angular/platform-browser";
import {EngineBridgeService} from "../../../../../core/service/engine-bridge.service";
import {ReplaySubject} from "rxjs";
import {debounceTime, takeUntil} from "rxjs/operators";

@Component({
    selector: 'app-add-engine-form',
    templateUrl: './add-engine-form.component.html',
    styleUrls: ['./add-engine-form.component.scss']
})
export class AddEngineFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    @Input() engine;
    engineForm = this.fb.group({
        name: [''],
        url: [''],
        icon: [''],
        iconTxt: [''],
        oneMultiSelect: [[]],
        andMultiSelect: [[]],
        orMultiSelect: [[]]
    });
    @ViewChildren('multiSelect') multiSelects !: QueryList<ElementRef>;

    constructor(private fb: FormBuilder,
                public domSanitizer: DomSanitizer,
                public engineBridgeService: EngineBridgeService) {
    }

    ngOnInit(): void {
        this.init();
    }

    ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    init() {
        this.engineForm.patchValue(this.engine);
        this.engineForm.controls['iconTxt'].valueChanges
            .pipe(
                takeUntil(this.destroyed$),
                debounceTime(50)
            )
            .subscribe(async value => {
                console.log(value);

                const icon = await readFileAsBase64Fn(new Blob(
                    [IconUtil.txtToSvg(value, 23, 23)],
                    {type: 'image/svg+xml'}
                ));

                this.engineForm.patchValue({icon});
            });
    }

    ngAfterViewInit() {

    }

    add() {
        const engine = SearchEngineUtil.createEngine(
            {
                name: this.engineForm.controls['name'].value,
                url: this.engineForm.controls['url'].value,
                icon: this.engineForm.controls['icon'].value
            }
        )
        this.engineBridgeService.add$.next(engine);
    }

    async pickIcon(target) {
        const icon = await readFileAsBase64Fn(target.files[0]);

        this.engineForm.patchValue({icon, iconTxt: ''});
    }

    updUrlWithParams() {
        const params = this.multiSelects.map(({nativeElement}) => {
            const {control, multi, name, divider, andOrDivider} = nativeElement.dataset;
            const {value} = this.engineForm.controls[control];

            return {name, value, multi, divider, andOrDivider};
        });

        const r = SearchEngineUtil.engineParamsToUrlParams(params);
        console.log('r', r)
    }

    selected(values) {
        console.log(values);
    }

    convertParamsToEntries(params) {
        return params.map(({name, param: value}) => ({name, value}));
    }

    prepareSelectEntries(values) {
        const selected = false;

        return values.map(value => ({...value, selected}));
    }

}
