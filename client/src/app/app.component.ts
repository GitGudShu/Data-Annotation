import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { NotificationService } from './services/notification.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})

export class AppComponent {
  notification: { message: string, type: 'success' | 'error' } | null = null;

	constructor(private authService: AuthService, private notificationService: NotificationService) {
    this.notificationService.notification$.subscribe(n => this.notification = n);
  }

	ngOnInit(): void {
		this.authService.initAuth();
	}

  clearNotification() {
    this.notificationService.clear();
  }

  title = 'Data-Annotation';
}
