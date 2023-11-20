import { Component } from '@angular/core';
import { IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';
import { Movie } from '@shared/models';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { RouterLink } from '@angular/router';
@Component({
  standalone: true,
  imports: [IonFab, IonFabButton, IonIcon, RouterLink, MovieCardComponent],
  selector: 'app-movies-list',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.scss'],
})
export default class MoviesListComponent {
  constructor() {
    addIcons({ add });
  }
  movies: Movie[] = [
    {
      uuid: '',
      title: 'Title test',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum interdum nisi odio, eget commodo nunc condimentum eget. Ut facilisis metus scelerisque lectus tincidunt luctus.',
      shortDescription:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum interdum nisi odio, eget commodo nunc condimentum eget. Ut facilisis metus scelerisque lectus tincidunt luctus.',
      rate: 3,
      releaseDate: '',
      genre: '',
      imagePath: '',
    },
  ];
}
