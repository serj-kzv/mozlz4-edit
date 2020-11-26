import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  title = 'sb-app';

  ngOnInit(): void {
    console.log(`${this.title} js is run! browser api is`, browser);
  }
}
