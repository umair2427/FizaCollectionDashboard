import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { skipWhile, take } from 'rxjs';
import { OrderService } from 'src/app/shared/service/order/order.service';

@Component({
  selector: 'app-edit-order',
  standalone: true,
  imports: [NgSelectModule, CommonModule, FormsModule],
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.scss'],
})
export class EditOrderComponent implements OnInit {

  statues: string[] = ['Confirm', 'Pending', 'Delivered', 'Shipped', 'Canceled'];
  selectedStatus!: string;

  loader: boolean = false;

  constructor(
    private matDialogRef: MatDialogRef<EditOrderComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private orderService: OrderService
  ) { }

  ngOnInit() {
    this.selectedStatus = this.data.order.status;
  }

  close() {
    this.matDialogRef.close();
  }

  onSubmit() {
    this.loader = true;
    let payload = {
      orderId: this.data.order.orderId,
      status: this.selectedStatus
    };
    this.orderService.updateOrderStatus(payload).pipe(skipWhile(val => !val), take(1)).subscribe(
      res => {
        if (res) {
          this.loader = false;
          this.matDialogRef.close('success');
        }
      },
      error => {
        console.error(error);
        this.loader = false;
      }
    )
  }

}
