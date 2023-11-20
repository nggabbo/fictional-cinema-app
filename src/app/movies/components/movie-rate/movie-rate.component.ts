import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { Movie, StorageKeys } from '@shared/models';
import { StorageService } from '@shared/services';
import { addIcons } from 'ionicons';
import { star } from 'ionicons/icons';

@Component({
  standalone: true,
  imports: [IonIcon],
  selector: 'app-movie-rate',
  templateUrl: './movie-rate.component.html',
  styleUrls: ['./movie-rate.component.scss'],
})
export class MovieRateComponent {
  @Input() rate: number = 0;
  @Input() uuid: string = '';

  #storageService = inject(StorageService);

  constructor() {
    addIcons({ star });
  }

  async selectRate(rate: number): Promise<void> {
    this.rate = rate;
    const moviesStored: Movie[] = await this.#storageService.get(
      StorageKeys.Movies
    );
    if (!moviesStored) {
      return;
    }

    const moviesUpdated = moviesStored.map((m) => {
      if (m.uuid === this.uuid) {
        return { ...m, rate };
      }
      return m;
    });
    this.#storageService.set(StorageKeys.Movies, moviesUpdated);
  }
}
