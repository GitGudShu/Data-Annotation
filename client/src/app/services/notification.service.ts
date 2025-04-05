import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<{ message: string, type: 'success' | 'error' } | null>(null);
  public notification$ = this.notificationSubject.asObservable();

  show(message: string, type: 'success' | 'error') {
    console.log('Notification:', message, type);
    this.notificationSubject.next({ message, type });

    setTimeout(() => {
      this.clear();
    }, 2000);
  }

  clear() {
    this.notificationSubject.next(null);
  }
}
