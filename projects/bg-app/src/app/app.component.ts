import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  title = 'bg-app';

  ngOnInit(): void {
    this.initAddonBtn();
  }

  initAddonBtn() {
    browser.browserAction.onClicked.addListener(
        async tab => {
          browser.tabs.create({
            url: '/ba-app/index.html'
          });
        }
    );
  }
}
