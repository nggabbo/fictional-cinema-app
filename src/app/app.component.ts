import { Component, OnInit, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { StorageService } from '@shared/services';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  #storageService = inject(StorageService);

  ngOnInit(): void {
    this.initDatabase();
  }

  async initDatabase(): Promise<void> {
    await this.#storageService.init();
  }
}
