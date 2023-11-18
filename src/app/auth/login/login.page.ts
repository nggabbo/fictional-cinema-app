import { NgStyle } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { PhotoInfo, StorageKeys } from '@shared/models';
import { PhotoService, StorageService } from '@shared/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, NgStyle],
})
export default class LoginPage {
  #photoService = inject(PhotoService);
  #storageService = inject(StorageService);
  #sanitizer = inject(DomSanitizer);

  loginForm = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
  });
  avatarDefaultSrc = 'assets/webp/profile-photo-placeholder.webp';
  avatarSrc: string | SafeUrl = this.avatarDefaultSrc;

  ionViewWillEnter(): void {
    this.#storageService
      .get(StorageKeys.AvatarPhoto)
      .then(async (photoInfo: PhotoInfo | null) => {
        const readFileResult = await this.#photoService.getFromGallery(
          photoInfo?.filepath ?? ''
        );
        if (readFileResult) {
          const base64Data = readFileResult.data as string;

          // Convert the base64 to a safe data URL
          this.avatarSrc = this.#sanitizer.bypassSecurityTrustUrl(base64Data);
        }
      });
  }

  async uploadAvatarPhoto(): Promise<void> {
    const avatarPhoto = await this.#photoService.addNewToGallery();
    if (avatarPhoto) {
      this.avatarSrc = avatarPhoto.webviewPath ?? this.avatarDefaultSrc;
      await this.#storageService.set(StorageKeys.AvatarPhoto, avatarPhoto);
    }
  }
}
