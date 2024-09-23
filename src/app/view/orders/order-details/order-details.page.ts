import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { skipWhile, take } from 'rxjs';
import { OrderService } from 'src/app/shared/service/order/order.service';


@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {
  productId: string = '';
  orders: any;
  user: any = {};
  shipping:  any = {};
  billing:  any = {};
  loader: boolean = true;
  constructor(private route: ActivatedRoute,
    private orderService: OrderService) { }

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    this.fetchProductDetails();
  }

  fetchProductDetails(): void {
    this.orderService.getSingleOrder(this.productId).pipe(skipWhile(val => !val), take(1)).subscribe(
      (res: any) => {
        this.orders = res.order;
        // this.user = order.user[0];
        // this.shipping = order.shipping[0];
        // this.billing = order.billing[0];
        this.loader = false;
      },
      error => {
        console.error('Error fetching product details:', error);
      }
    );
  }
}
