import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, skipWhile, take } from 'rxjs/operators';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { ProfileComponent } from './shared/components/profile/profile.component';
import { MatDialog } from '@angular/material/dialog';
import * as io from 'socket.io-client';
import { OrderService } from './shared/service/order/order.service';
import { NotificationsComponent } from './shared/components/notifications/notifications.component';
import { NotificationService } from './shared/service/notification/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public productDashboard = {
    is_products_open: false,
    is_dashboard_open: false,
  };
  public orderDashboard = {
    is_order_open: false,
    is_dashboard_open: false,
  };
  showHeader: boolean = true;
  socket!: io.Socket;
  notificationCount = 0;

  constructor(public router: Router,
    private notificationService: NotificationService,
    public dialog: MatDialog,) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.showHeader = event.url !== '/' && event.url !== '/login';
        }
      });
    this.socket = io.connect('http://localhost:3000', { transports: ['websocket', 'polling', 'flashsocket'] });
    this.notificationService.notifications$.subscribe(count => {
      this.notificationCount = count;
    });
  }

  toggleDropdown(key: 'is_products_open' | 'is_dashboard_open') {
    this.productDashboard[key] = !this.productDashboard[key];
  }

  orderToggleDropdown(key: 'is_order_open' | 'is_dashboard_open') {
    this.orderDashboard[key] = !this.orderDashboard[key];
  }

  ngOnInit(): void {
    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('newOrder', (message: string) => {
      console.log('Received notification:', message);
      this.notificationService.addNotification();
      // Handle the notification
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(NotificationsComponent, {
      width: '250px',
      height: '300px',
      position: { right: '13%', top: '3%' },
    });
    this.markAsRead();

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openProfileDialog() {
    this.dialog.open(ProfileComponent, {
      disableClose: true,
      width: '300px',
      height: '120px',
      position: { right: '0px', top: '70px' },
      panelClass: ['animate__animated', 'animate__slideInRight'],
    });
  }

  products() {
    this.router.navigate(['/products']);
  }

  addProduct() {
    this.router.navigate(['/add-product']);
  }

  orders() {
    this.router.navigate(['/orders']);
  }
  createOrder() {
    this.router.navigate(['/create-order']);
  }

  login() {
    this.router.navigate(['/login']);
  }

  markAsRead() {
    this.notificationService.clearNotifications();
  }
}
