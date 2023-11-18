import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IonToast } from '@ionic/angular/standalone';

export interface GenericToastData {
  isOpen: boolean;
  duration: number;
  position: 'top' | 'middle' | 'bottom';
  message: string;
  color: string;
}

@Component({
  standalone: true,
  imports: [IonToast],
  selector: 'app-generic-toast',
  templateUrl: './generic-toast.component.html',
  styleUrls: ['./generic-toast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericToastComponent {
  @Input() toastData: GenericToastData = {
    isOpen: false,
    color: 'primary',
    duration: 3500,
    message: '',
    position: 'top',
  };

  closeToast(): void {
    this.toastData = { ...this.toastData, isOpen: false };
  }
}
