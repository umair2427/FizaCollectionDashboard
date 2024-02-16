import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';

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

  constructor(public router: Router, private activatedRoute: ActivatedRoute, private angularFireMessaging: AngularFireMessaging,) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.showHeader = event.url !== '/' && event.url !== '/login';
        }
      });
  }

  toggleDropdown(key: 'is_products_open' | 'is_dashboard_open') {
    this.productDashboard[key] = !this.productDashboard[key];
  }

  orderToggleDropdown(key: 'is_order_open' | 'is_dashboard_open') {
    this.orderDashboard[key] = !this.orderDashboard[key];
  }

  ngOnInit(): void {
    this.angularFireMessaging.requestToken.subscribe((res)=>{
      console.log("Token", res);
    });
    this.angularFireMessaging.messages.subscribe((res)=>{
      console.log("Message", res);
    })
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
