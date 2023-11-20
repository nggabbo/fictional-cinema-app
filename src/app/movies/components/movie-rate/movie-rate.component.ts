import { Component, Input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
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

  constructor() {
    addIcons({ star });
  }
}
