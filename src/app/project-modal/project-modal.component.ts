import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-project-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-modal.component.html',
  styleUrls: ['./project-modal.component.scss'],
  animations: [
    trigger('backdrop', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition('void <=> *', animate('200ms ease-in-out'))
    ]),
    trigger('panel', [
      state('void', style({ transform: 'translateY(20px)', opacity: 0 })),
      state('*', style({ transform: 'translateY(0)', opacity: 1 })),
      transition('void <=> *', animate('220ms cubic-bezier(.2,.8,.2,1)'))
    ])
  ]
})
export class ProjectModalComponent {
  @Input() project: any = null;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
