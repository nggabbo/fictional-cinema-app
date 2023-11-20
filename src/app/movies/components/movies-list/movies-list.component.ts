import { Component, DestroyRef, inject } from '@angular/core';
import { IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';
import { Movie, StorageKeys } from '@shared/models';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { RouterLink } from '@angular/router';
import { MoviesListService, StorageService } from '@shared/services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  imports: [IonFab, IonFabButton, IonIcon, RouterLink, MovieCardComponent],
  selector: 'app-movies-list',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.scss'],
})
export default class MoviesListComponent {
  #destroyRef = inject(DestroyRef);
  #storageService = inject(StorageService);
  #moviesListService = inject(MoviesListService);
  movies: Movie[] = [];

  constructor() {
    addIcons({ add });
  }

  ionViewWillEnter(): void {
    this.#storageService
      .get(StorageKeys.Movies)
      .then((movies: Movie[]) => {
        this.movies = movies;
      })
      .catch((err) => {
        console.error(err);
      });
    this.#moviesListService
      .onListRefresh()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.#storageService
          .get(StorageKeys.Movies)
          .then((movies: Movie[]) => {
            this.movies = movies;
          })
          .catch((err) => {
            console.error(err);
          });
      });
  }
}
