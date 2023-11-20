import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonIcon, IonItem, IonLabel, IonList, IonMenuToggle } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { videocam } from 'ionicons/icons';

@Component({
  standalone: true,
  imports: [IonList, IonItem, IonLabel, IonIcon, IonMenuToggle, RouterLink],
  selector: 'app-navigation-list-component',
  templateUrl: './navigation-list-component.html',
  styleUrls: ['./navigation-list-component.scss'],
})
export class NavigationListComponent {
  constructor() {
    addIcons({ videocam });
  }
}
