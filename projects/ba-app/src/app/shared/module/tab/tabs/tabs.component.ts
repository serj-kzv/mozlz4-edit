import {AfterContentInit, Component, ContentChildren, OnDestroy, QueryList} from '@angular/core';
import {TabContentComponent} from "../tab/tab-content.component";
import {ReplaySubject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements AfterContentInit, OnDestroy {
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    pick$ = new ReplaySubject<TabContentComponent>(1);
    @ContentChildren(TabContentComponent) tabs!: QueryList<TabContentComponent>;

    ngAfterContentInit() {
        this.pick$
            .pipe(takeUntil(this.destroyed$))
            .subscribe(clickedTab => this.tabs.forEach(tab => tab.active = clickedTab === tab));
    }

    ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
