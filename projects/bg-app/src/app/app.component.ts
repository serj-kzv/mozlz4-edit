import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  title = 'bg-app';

  ngOnInit(): void {
    console.log(`${this.title} js is run! browser api is`, browser);
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
