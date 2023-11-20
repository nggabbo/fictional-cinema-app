import { Directive, ElementRef, Input, inject, HostListener } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[fallbackImage]',
  standalone: true
})
export class FallbackImageDirective {

  @Input() urlFallback: string = 'assets/webp/movie-fallback.webp';
  #eRef = inject(ElementRef);

  @HostListener('error')
  loadFallbackOnError() {
    const element: HTMLImageElement = this.#eRef.nativeElement;
    element.src = this.urlFallback;
  }

}
