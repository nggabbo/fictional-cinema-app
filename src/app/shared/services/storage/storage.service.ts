import { Injectable, inject } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { StorageKeys } from '@shared/models';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  #storage: Storage | null = null;
  #storageService = inject(Storage);

  public async init() {
    const storage = await this.#storageService.create();
    this.#storage = storage;
  }

  public async set(key: StorageKeys, value: any): Promise<void> {
    await this.#storage?.set(key, value);
  }

  public async get(key: StorageKeys): Promise<any> {
    return await this.#storage?.get(key);
  }
}
