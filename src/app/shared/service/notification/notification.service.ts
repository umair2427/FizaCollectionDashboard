import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notifications = new BehaviorSubject<number>(0);
  notifications$ = this.notifications.asObservable();

  constructor() {}

  addNotification() {
    this.notifications.next(this.notifications.value + 1);
  }

  setNotifications(count: number) {
    this.notifications.next(count);
  }

  clearNotifications() {
    this.notifications.next(0);
  }
}
