import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/shared/service/order/order.service';
import { Product } from 'src/app/shared/service/product/Product';


@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {
  productId: number | null = null;
  orders: Product[] = [];
  user: any = {};
  shipping:  any = {};
  billing:  any = {};
  loader: boolean = true;
  constructor(private route: ActivatedRoute,
    private orderService: OrderService) { }

  ngOnInit() {
    this.fetchProductDetails();
  }

  fetchProductDetails(): void {
    this.route.params.subscribe(params => {
      this.productId = +params['id'];
      if (this.productId) {
        this.orderService.getSingleOrder(this.productId).subscribe(
          (order: any) => {
            this.orders = order.order;
            this.user = order.user[0];
            this.shipping = order.shipping[0];
            this.billing = order.billing[0];
            this.loader = false;
          },
          error => {
            console.error('Error fetching product details:', error);
          }
        );
      }
    });
  }

  getTotalAmountSum(): number {
    let sum = 0;
    for (const order of this.orders) {
      sum += (order.productPrice!) * (order.quantity!);
    }
    return sum;
  }

}
