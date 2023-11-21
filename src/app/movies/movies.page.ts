import { Component, inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {
  IonAvatar,
  IonButtons,
  IonContent,
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
import { close } from 'ionicons/icons';
import { PhotoService, StorageService } from '@shared/services';
import { StorageKeys, PhotoInfo } from '@shared/models';
import { FallbackImageDirective } from '@shared/directives';

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
    IonAvatar,
    NavigationListComponent,
    FallbackImageDirective
  ],
})
export default class MoviesPage implements OnInit {
  #photoService = inject(PhotoService);
  #storageService = inject(StorageService);
  #sanitizer = inject(DomSanitizer);

  avatarImagePath: SafeUrl | string = '';

  constructor() {
    addIcons({ close });
  }

  ngOnInit(): void {
    this.fetchAvatarImagePathFromStorage();
  }

  async fetchAvatarImagePathFromStorage(): Promise<void> {
    const avatarImagePath: PhotoInfo = await this.#storageService.get(
      StorageKeys.AvatarPhoto
    );
    await this.findImageStored(avatarImagePath.filepath);
  }

  // TODO: Refactor this and all matching ones. Create a service or directive to reuse.
  async findImageStored(path: string): Promise<void> {
    console.log(path, 'a')
    const readFileResult = await this.#photoService.getFromGallery(path);
    if (readFileResult) {
      const base64Data = readFileResult.data as string;

      // Convert the base64 to a safe data URL
      this.avatarImagePath = this.#sanitizer.bypassSecurityTrustUrl(base64Data);
    }
  }
}
