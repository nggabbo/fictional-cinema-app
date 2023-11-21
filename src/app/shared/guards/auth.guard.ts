import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageKeys } from '@shared/models';
import { StorageService } from '@shared/services';

export const AuthGuard: CanActivateFn = async () => {
  const storageService = inject(StorageService);
  const router = inject(Router);
  const session = await storageService.get(StorageKeys.AuthenticatedUser);

  if (session) {
    return true;
  }

  router.navigate(['/auth']);
  return false;
};
