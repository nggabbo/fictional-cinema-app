import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MoviesListService {
  private refreshListSubject$ = new Subject<void>();

  public triggerListRefresh(): void {
    this.refreshListSubject$.next();
  }

  public onListRefresh(): Observable<void> {
    return this.refreshListSubject$.asObservable();
  }
}
