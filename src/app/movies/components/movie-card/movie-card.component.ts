import { Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonIcon,
} from '@ionic/angular/standalone';
import { FallbackImageDirective } from '@shared/directives';
import { Movie, StorageKeys } from '@shared/models';
import {
  StorageService,
  MoviesListService,
  PhotoService,
} from '@shared/services';
import { addIcons } from 'ionicons';
import { create, trash, eye } from 'ionicons/icons';
import { MovieRateComponent } from '../movie-rate/movie-rate.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  standalone: true,
  imports: [
    IonCard,
    IonCardTitle,
    IonCardHeader,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonChip,
    MovieRateComponent,
    FallbackImageDirective,
  ],
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  @Input({ required: true }) movieData: Movie = {
    uuid: '',
    title: '',
    description: '',
    shortDescription: '',
    rate: 0,
    releaseDate: '',
    genre: '',
    imagePath: '',
  };

  #router = inject(Router);
  #photoService = inject(PhotoService);
  #sanitizer = inject(DomSanitizer);
  #storageService = inject(StorageService);
  #alertCtrl = inject(AlertController);
  #moviesListService = inject(MoviesListService);

  imageMoviePath: SafeUrl | string = '';

  constructor() {
    addIcons({ trash, create, eye });
  }

  ngOnInit(): void {
    this.findImageStored(this.movieData.imagePath);
  }

  navigateForEditMovie(): void {
    this.#router.navigate(['/movies/edit/', this.movieData.uuid]);
  }

  async showRemoveMovieAlert(): Promise<void> {
    const alert = await this.#alertCtrl.create({
      header: 'Remove Movie',
      message: 'Are you sure you want to remove this movie?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'Remove',
          handler: async () => await this.removeMovie(),
        },
      ],
      animated: true,
      translucent: true,
    });

    await alert.present();
  }

  async removeMovie(): Promise<void> {
    const moviesStored: Movie[] = await this.#storageService.get(
      StorageKeys.Movies
    );
    if (!moviesStored) {
      return;
    }

    const moviesFiltered = moviesStored.filter(
      (movie) => movie.uuid !== this.movieData.uuid
    );
    await this.#storageService.set(StorageKeys.Movies, moviesFiltered);
    this.#moviesListService.triggerListRefresh();
  }

  showMovie(): void {
    this.#router.navigate(['/movies/show/', this.movieData.uuid]);
  }

  async findImageStored(path: string): Promise<void> {
    const readFileResult = await this.#photoService.getFromGallery(path);
    if (readFileResult) {
      const base64Data = readFileResult.data as string;

      // Convert the base64 to a safe data URL
      this.imageMoviePath = this.#sanitizer.bypassSecurityTrustUrl(base64Data);
    }
  }
}
