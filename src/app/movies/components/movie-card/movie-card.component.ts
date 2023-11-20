import { Component, Input } from '@angular/core';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
} from '@ionic/angular/standalone';
import { Movie } from '@shared/models';
import { addIcons } from 'ionicons';
import { trash, create } from 'ionicons/icons';
import { MovieRateComponent } from '../movie-rate/movie-rate.component';
import { FallbackImageDirective } from '@shared/directives';

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
    MovieRateComponent,
    FallbackImageDirective
  ],
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent {
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

  constructor() {
    addIcons({ trash, create });
  }
}
