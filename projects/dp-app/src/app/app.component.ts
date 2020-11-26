import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  title = 'dp-app';

  ngOnInit(): void {
    console.log(`${this.title} js is run! browser api is`, browser);
    this.createPanel();
  }

  private async createPanel() {
    const panel = await browser.devtools.panels.create(
        "dpanel-app",
        "/dpanel-app/favicon.ico",
        "/dpanel-app/index.html"
    );

    panel.onShown.addListener(() => console.log("dp-app panel is being shown", panel));
    panel.onHidden.addListener(() => console.log("dp-app panel is being hidden", panel));
  }
}
