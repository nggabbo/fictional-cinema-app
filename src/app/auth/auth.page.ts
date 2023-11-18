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
import { GenericToastComponent, GenericToastData } from '@shared/components';
import { Credential, PhotoInfo, StorageKeys } from '@shared/models';
import { PhotoService, StorageService } from '@shared/services';
import { addIcons } from 'ionicons';
import { eye, eyeOff } from 'ionicons/icons';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, NgStyle, GenericToastComponent],
})
export default class AuthPage {
  #photoService = inject(PhotoService);
  #storageService = inject(StorageService);
  #sanitizer = inject(DomSanitizer);

  form = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
  });
  showPassword = false;
  authToast: GenericToastData = {
    isOpen: false,
    duration: 3500,
    position: 'top',
    message: '',
    color: 'primary',
  };
  avatarDefaultSrc = 'assets/webp/profile-photo-placeholder.webp';
  avatarSrc: string | SafeUrl = this.avatarDefaultSrc;

  constructor() {
    addIcons({ eye, eyeOff });
  }

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

  async signIn(): Promise<void> {
    const storedCredentials: Credential[] | null =
      await this.#storageService.get(StorageKeys.Credentials);

    if (!storedCredentials) {
      console.error('Error retrieving stored credentials.');
      this.authToast = {
        duration: 3500,
        isOpen: true,
        message: 'Oops! Wrong credentials. Retry or click "Create account".',
        position: 'top',
        color: 'danger',
      };
      return;
    }

    const credential = storedCredentials.find(
      (credential) => credential.username === this.form.value.username
    );

    if (credential && credential.password === this.form.value.password) {
      await this.#storageService.set(StorageKeys.AuthenticatedUser, {
        username: credential.username,
      });
      this.authToast = {
        duration: 3500,
        isOpen: true,
        message:
          "Hello again! We're delighted to see you. Your login was a success.",
        position: 'top',
        color: 'primary',
      };
    } else {
      this.authToast = {
        duration: 3500,
        isOpen: true,
        message:
          'There seems to have been an error logging in. Check your details and try again, or click "Forgot password?" if necessary.',
        position: 'top',
        color: 'danger',
      };
    }
  }

  async createAccount(): Promise<void> {
    const newCredential: Credential = {
      username: this.form.value.username!,
      password: this.form.value.password!,
    };

    const storedCredentials: Credential[] | null =
      await this.#storageService.get(StorageKeys.Credentials);

    if (storedCredentials) {
      const userExists = storedCredentials.some(
        (credential) => credential.username === newCredential.username
      );

      if (userExists) {
        this.authToast = {
          duration: 3500,
          isOpen: true,
          message:
            'Oops! The username is already in use. Please choose another one.',
          position: 'top',
          color: 'danger',
        };
        return;
      }

      this.#storageService.set(StorageKeys.Credentials, [
        ...storedCredentials,
        newCredential,
      ]);
    } else {
      this.#storageService.set(StorageKeys.Credentials, [newCredential]);
    }

    await this.#storageService.set(StorageKeys.AuthenticatedUser, {
      username: this.form.value.username,
    });
    this.authToast = {
      duration: 3500,
      isOpen: true,
      message:
        'Hello there, new friend! Your registration was successful. Welcome to Fictional Cinema.',
      position: 'top',
      color: 'primary',
    };
  }
}
