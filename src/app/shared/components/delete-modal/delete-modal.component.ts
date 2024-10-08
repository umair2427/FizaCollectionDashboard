import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../../service/product/product.service';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderService } from '../../service/order/order.service';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss'],
})
export class DeleteModalComponent implements OnInit {
  isLoading$!: Observable<boolean>;
  product: string = '';
  constructor(
    private dialogRef: MatDialogRef<DeleteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { productId: number, selectedProductIds: string[], shipping_id: number, selectedOrderIds: number[] },
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private orderService: OrderService) { console.log(data)}

  ngOnInit() {
    this.isLoading$ = this.productService.isLoading$;
    if (this.data.productId) {
      this.product = 'this product';
    } else if (this.data.selectedProductIds) {
      this.product = 'these products';
    } else if (this.data.shipping_id) {
      this.product = 'this order';
    } else if (this.data.selectedOrderIds) {
      this.product = 'these orders'
    } else {
      console.log("Hello");
    }
  }

  close() {
    this.dialogRef.close();
  }

  deleteProduct(): void {
    this.productService.deleteProduct(this.data.productId).subscribe(
      (data) => {
        this.snackBar.open(data.message, 'OK', {
          duration: 2000,
        });
        this.dialogRef.close(true);
      },
      (error) => {
        console.error('Error:', error);
        this.snackBar.open('Error deleting product', 'OK', {
          duration: 2000,
        });
        this.dialogRef.close(false);
      }
    );
  }

  deleteOrder(): void {
    this.orderService.deleteOrder(this.data.shipping_id).subscribe(
      (data) => {
        this.snackBar.open(data.message, 'OK', {
          duration: 2000,
        });
        this.dialogRef.close(true);
      },
      (error) => {
        console.error('Error:', error);
        this.snackBar.open('Error deleting order', 'OK', {
          duration: 2000,
        });
        this.dialogRef.close(false);
      }
    );
  }

  deleteMultipleProducts(): void {
    let payload = {
      ids: this.data?.selectedProductIds
    }
    this.productService.deleteMultipleProducts(payload).subscribe(
      (data) => {
        this.snackBar.open(data.message, 'OK', {
          duration: 2000,
        });
        this.dialogRef.close(true);
      },
      (error) => {
        console.error('Error:', error);
        this.snackBar.open('Error deleting product', 'OK', {
          duration: 2000,
        });
        this.dialogRef.close(false);
      }
    );
  }

  deleteMultipleOrders(): void {
    this.orderService.deleteMultipleOrders(this.data.selectedOrderIds).subscribe(
      (data) => {
        this.snackBar.open(data.message, 'OK', {
          duration: 2000,
        });
        this.dialogRef.close(true);
      },
      (error) => {
        console.error('Error:', error);
        this.snackBar.open('Error deleting product', 'OK', {
          duration: 2000,
        });
        this.dialogRef.close(false);
      }
    );
  }

  handleButtonClick() {
    if (this.data.productId) {
      this.deleteProduct();
    } else if (this.data.selectedProductIds) {
      this.deleteMultipleProducts();
    } else if (this.data.shipping_id) {
      this.deleteOrder();
    } else if (this.data.selectedOrderIds) {
      this.deleteMultipleOrders();
    } else {
      console.error("Something bad happen");
    }
  }

}
