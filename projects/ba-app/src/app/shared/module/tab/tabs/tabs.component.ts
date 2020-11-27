import {AfterContentInit, Component, ContentChildren, OnDestroy, OnInit, QueryList} from '@angular/core';
import {TabComponent} from "../tab/tab.component";
import {ReplaySubject, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit, AfterContentInit, OnDestroy {
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    pick = new Subject<TabComponent>();
    @ContentChildren(TabComponent, {descendants: true}) tabs!: QueryList<TabComponent>;

    constructor() {
    }

    ngOnInit(): void {
    }

    ngAfterContentInit() {
        this.pick
            .pipe(takeUntil(this.destroyed$))
            .subscribe(clickedTab => this.tabs.forEach(tab => tab.active = clickedTab == tab));
    }

    ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }


}
