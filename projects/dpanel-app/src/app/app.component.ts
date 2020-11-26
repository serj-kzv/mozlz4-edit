import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  title = 'dpanel-app';

  ngOnInit(): void {
    console.log(`${this.title} js is run! browser api is`, browser);
  }
}
