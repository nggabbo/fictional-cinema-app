import { Component, Input, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { ToastController } from '@ionic/angular';
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

  #sanitizer = inject(DomSanitizer);
  #router = inject(Router);
  #toastCtrl = inject(ToastController);
  #photoService = inject(PhotoService);
  #storageService = inject(StorageService);

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

  async saveMovie(): Promise<void> {
    if (this.uuid) {
      this.updateMovie();
    } else {
      this.createMovie();
    }
    this.#router.navigate(['/movies']);
    const toast = await this.#toastCtrl.create({
      message: 'Success! Your movie has been saved.',
      duration: 3500,
      position: 'bottom',
      color: 'tertiary',
      translucent: true,
      animated: true,
    });
    await toast.present();
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
      await this.#storageService.set(StorageKeys.Movies, movies);
    }
  }

  async createMovie(): Promise<void> {
    this.form.patchValue({ uuid: GenerateUUID() });
    const moviesStored: Movie[] = await this.#storageService.get(
      StorageKeys.Movies
    );
    if (moviesStored) {
      const movies = [...moviesStored, this.form.value];
      await this.#storageService.set(StorageKeys.Movies, movies);
    } else {
      await this.#storageService.set(StorageKeys.Movies, [this.form.value]);
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

  // TODO: Refactor this and all matching ones. Create a service or directive to reuse.
  async findImageStored(path: string): Promise<void> {
    const readFileResult = await this.#photoService.getFromGallery(path);
    if (readFileResult) {
      const base64Data = readFileResult.data as string;

      // Convert the base64 to a safe data URL
      this.movieImage = this.#sanitizer.bypassSecurityTrustUrl(base64Data);
    }
  }
}
