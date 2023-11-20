import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonFooter,
  IonHeader,
  IonIcon,
  IonMenu,
  IonMenuButton,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { NavigationListComponent } from '@shared/components';
import { addIcons } from 'ionicons';
import { close, add } from 'ionicons/icons';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
  standalone: true,
  imports: [
    IonRouterOutlet,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonMenuButton,
    IonIcon,
    IonFooter,
    IonFab,
    IonFabButton,
    RouterLink,
    NavigationListComponent,
  ],
})
export default class MoviesPage {
  constructor() {
    addIcons({ close, add });
  }
}
