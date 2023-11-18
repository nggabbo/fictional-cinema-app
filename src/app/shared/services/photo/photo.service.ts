import { Injectable } from '@angular/core';
import { Camera, CameraResultType, Photo } from '@capacitor/camera';
import {
  Directory,
  Encoding,
  Filesystem,
  ReadFileResult,
} from '@capacitor/filesystem';
import { PhotoInfo } from '@shared/models';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  async #readAsBase64(photo: Photo) {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();

    return (await this.#convertBlobToBase64(blob)) as string;
  }

  #convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });

  async #savePicture(photo: Photo) {
    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.#readAsBase64(photo);

    // Write the file to the data directory
    const fileName = Date.now() + `.${photo.format}`;
    await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });

    // Use webPath to display the new image instead of base64 since it's
    // already loaded into memory
    return {
      filepath: fileName,
      webviewPath: photo.webPath,
    };
  }

  public async addNewToGallery(): Promise<PhotoInfo> {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
    });

    const photoInfo: PhotoInfo = await this.#savePicture(photo);
    return photoInfo;
  }

  public async getFromGallery(path: string): Promise<ReadFileResult | void> {
    const contents = await Filesystem.readFile({
      path,
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    }).catch(console.error);

    return contents;
  }
}
