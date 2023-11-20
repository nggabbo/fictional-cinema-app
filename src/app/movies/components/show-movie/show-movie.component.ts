import { Component, Input, inject } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { IonThumbnail } from '@ionic/angular/standalone';
import { FallbackImageDirective } from '@shared/directives';
import { Movie, StorageKeys } from '@shared/models';
import { PhotoService, StorageService } from '@shared/services';
import { MovieRateComponent } from '../movie-rate/movie-rate.component';
import { DatePipe } from '@angular/common';

@Component({
  standalone: true,
  imports: [DatePipe, IonThumbnail, FallbackImageDirective, MovieRateComponent],
  selector: 'app-show-movie',
  templateUrl: './show-movie.component.html',
  styleUrls: ['./show-movie.component.scss'],
})
export default class ShowMovieComponent {
  @Input() uuid: string = '';

  #storageService = inject(StorageService);
  #photoService = inject(PhotoService);
  #sanitizer = inject(DomSanitizer);

  movie?: Movie;
  imageMoviePath: string | SafeUrl = '';

  ionViewWillEnter(): void {
    if (this.uuid) {
      this.findMovieByUUID();
    }
  }

  async findMovieByUUID(): Promise<void> {
    const moviesStored: Movie[] = await this.#storageService.get(
      StorageKeys.Movies
    );

    if (!moviesStored) {
      return;
    }

    const movie = moviesStored.find((m) => m.uuid === this.uuid);
    if (movie) {
      this.movie = movie;
      this.findImageStored(movie.imagePath);
    }
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
