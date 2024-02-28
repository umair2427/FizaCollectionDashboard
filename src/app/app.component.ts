import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { ProfileComponent } from './shared/components/profile/profile.component';
import { MatDialog } from '@angular/material/dialog';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
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

  constructor(public router: Router, private activatedRoute: ActivatedRoute,
    private angularFireMessaging: AngularFireMessaging,
    public dialog: MatDialog,) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.showHeader = event.url !== '/' && event.url !== '/login';
        }
      });
      this.socket = io.connect('http://localhost:3000', { transports: ['websocket', 'polling', 'flashsocket'] });
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
      // Handle the notification
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
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
}
