import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../service/order/order.service';
import { skipWhile, take } from 'rxjs';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];
  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.getNotifications();
  }

  getNotifications() {
    this.orderService.getNotifications().pipe(skipWhile(val => !val), take(1)).subscribe(res => {
      this.notifications = res?.notifications;
    })
  }

}
