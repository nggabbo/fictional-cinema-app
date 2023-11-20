import { Component } from '@angular/core';
import { Movie } from '@shared/models';
import { MovieCardComponent } from '../movie-card/movie-card.component';

@Component({
  standalone: true,
  imports: [MovieCardComponent],
  selector: 'app-movies-list',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.scss'],
})
export default class MoviesListComponent {
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
      image: { filepath: '', webviewPath: '' },
    },
  ];
}
