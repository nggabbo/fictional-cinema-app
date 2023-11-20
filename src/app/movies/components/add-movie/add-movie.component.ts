import { Component, Input, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
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
  @Input() uuid: string = '';

  #photoService = inject(PhotoService);
  #storageService = inject(StorageService);
  #sanitizer = inject(DomSanitizer);

  movieImage: SafeUrl | string = 'assets/webp/movie-fallback.webp';
  todayDate = new Date().toISOString();
  maxDate = this.todayDate;

  form = new FormGroup({
    uuid: new FormControl('', { nonNullable: true }),
    imagePath: new FormControl(''),
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
    rate: new FormControl(0, { nonNullable: true }),
  });

  ionViewWillEnter(): void {
    if (this.uuid) {
      this.findMovieForEditAndPatchForm();
    }
  }

  async uploadMovieImage(): Promise<void> {
    const movieImageStored = await this.#photoService.addNewToGallery();
    if (movieImageStored) {
      this.movieImage =
        movieImageStored.webviewPath ?? 'assets/webp/movie-fallback.webp';
      this.form.patchValue({ imagePath: movieImageStored.filepath });
    }
  }

  saveMovie(): void {
    if (this.uuid) {
      this.updateMovie();
    } else {
      this.createMovie();
    }
  }

  async updateMovie(): Promise<void> {
    const moviesStored: Movie[] = await this.#storageService.get(
      StorageKeys.Movies
    );
    if (moviesStored) {
      const movies = moviesStored.map((movie) => {
        if (movie.uuid === this.uuid) {
          return this.form.value;
        }
        return movie;
      });
      this.#storageService.set(StorageKeys.Movies, movies);
    }
  }

  async createMovie(): Promise<void> {
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

  async findMovieForEditAndPatchForm(): Promise<void> {
    const moviesStored: Movie[] = await this.#storageService.get(
      StorageKeys.Movies
    );
    if (!moviesStored) {
      return;
    }

    const movie = moviesStored.find((movie) => movie.uuid === this.uuid);
    if (movie) {
      this.form.patchValue(movie);
      await this.findImageStored(movie.imagePath);
    }
  }

  async findImageStored(path: string): Promise<void> {
    const readFileResult = await this.#photoService.getFromGallery(path);
    if (readFileResult) {
      const base64Data = readFileResult.data as string;

      // Convert the base64 to a safe data URL
      this.movieImage = this.#sanitizer.bypassSecurityTrustUrl(base64Data);
    }
  }
}
