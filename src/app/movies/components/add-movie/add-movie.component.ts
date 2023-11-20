import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonDatetime,
  IonDatetimeButton,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonRippleEffect,
  IonTextarea,
  IonThumbnail,
} from '@ionic/angular/standalone';
import { FallbackImageDirective } from '@shared/directives';
import { Movie, StorageKeys } from '@shared/models';
import { PhotoService, StorageService } from '@shared/services';
import { GenerateUUID } from '@shared/utils';

@Component({
  standalone: true,
  imports: [
    IonInput,
    IonThumbnail,
    IonTextarea,
    IonDatetime,
    IonDatetimeButton,
    IonModal,
    IonRippleEffect,
    IonLabel,
    IonItem,
    IonButton,
    RouterLink,
    ReactiveFormsModule,
    FallbackImageDirective,
  ],
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.scss'],
})
export default class AddMovieComponent {
  #photoService = inject(PhotoService);
  #storageService = inject(StorageService);

  movieImage = 'assets/webp/movie-fallback.webp';
  todayDate = new Date().toISOString();
  maxDate = this.todayDate;

  form = new FormGroup({
    uuid: new FormControl('', { nonNullable: true }),
    image: new FormControl(''),
    title: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    shortDescription: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    releaseDate: new FormControl(this.todayDate, {
      nonNullable: true,
      validators: Validators.required,
    }),
    genre: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
  });

  async uploadMovieImage(): Promise<void> {
    const movieImageStored = await this.#photoService.addNewToGallery();
    if (movieImageStored) {
      this.movieImage =
        movieImageStored.webviewPath ?? 'assets/webp/movie-fallback.webp';
      this.form.patchValue({ image: movieImageStored.filepath });
    }
  }

  async saveMovie(): Promise<void> {
    this.form.patchValue({ uuid: GenerateUUID() });
    const moviesStored: Movie[] = await this.#storageService.get(
      StorageKeys.Movies
    );
    if (moviesStored) {
      const movies = [...moviesStored, this.form.value];
      this.#storageService.set(StorageKeys.Movies, movies);
    } else {
      this.#storageService.set(StorageKeys.Movies, [this.form.value]);
    }
  }
}
