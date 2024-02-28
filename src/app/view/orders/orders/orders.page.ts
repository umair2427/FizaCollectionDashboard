import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { OrderService } from 'src/app/shared/service/order/order.service';
import { Router } from '@angular/router';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from 'src/app/shared/service/product/product.service';

interface items {
  id?: number;
  name?: string;
  data?: any;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  dialogRef!: MatDialogRef<DeleteModalComponent>;
  orders: any[] = [];
  deliveryStatus: items[] = [];
  paymentMethod: items[] = [];
  pageSize = 10;
  pageIndex:number = 0;
  selectedOrders: any[] = [];
  totalItems: number = 0;
  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private cdRef: ChangeDetectorRef,
    private orderService: OrderService,
    private router: Router,
    public dialog: MatDialog,
    private productService: ProductService,
  ) { }

  ngOnInit() {
    this.getOrderItems(1, this.pageSize);
    this.showDeliveryStatus();
    this.getPaymentMethod();
  }
  displayedColumns: string[] = [
    'check',
    'order_id',
    'products',
    'order_date',
    'amount',
    'paymentMethod',
    'deliveryStatus',
    'action'
  ];
  removeProduct: boolean = false;
  dataSource = new MatTableDataSource(this.orders);
  selectedProducts: any[] = [];

  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;

    this.dataSource.paginator = this.paginator;
    this.cdRef.detectChanges();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  changeSelect(order: any) {
    if (this.isSelected(order)) {
      this.selectedProducts = this.selectedProducts.filter(
        (selectedProduct) => selectedProduct.shipping_id !== order.shipping_id
      );
    } else {
      this.selectedProducts.push(order);
    }
    this.removeProduct = this.selectedProducts.length > 0;
  }


  isSelected(order: any): boolean {
    return this.selectedProducts.some(
      (selectedProduct) => selectedProduct.shipping_id === order.shipping_id
    );
  }
  selectedStatusFilter: number = 1;
  selectedPaymentFilter: number = 1;

  applyFilters() {
    this.dataSource.data = this.dataSource.data.filter((order) => order.s_id === this.selectedStatusFilter && order.paymentMethod === this.selectedPaymentFilter)
  }

  getOrderItems(page: number, pageSize: number) {
    this.orderService.getOrders(page, pageSize).subscribe(
      (response) => {
        this.dataSource.data = response.orders;
        this.totalItems = response.totalCount;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  showDeliveryStatus() {
    this.productService.getDeliveryStatus().subscribe((res: items) => {
      this.deliveryStatus = res.data;
    },
      (error) => {
        console.error('Error fetching status:', error);
      })
  }

  getPaymentMethod() {
    this.productService.getPaymentMethod().subscribe((res: items) => {
      this.paymentMethod = res.data;
    },
      (error) => {
        console.error('Error fetching status:', error);
      })
  }

  navigateToProductDetail(productId?: number) {
    if (productId) {
      this.router.navigate(['order-details', productId]);
    } else {
      console.error('Product ID is undefined');
    }
  }

  openDialog(shipping_id: number) {
    this.dialogRef = this.dialog.open(DeleteModalComponent, {
      disableClose: true,
      width: '400px',
      height: 'auto',
      data: { shipping_id }
    });
    if (this.dialogRef) {
      this.dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getOrderItems(1, this.pageSize);
        }
      });
    }
  }

  removeSelectedProducts(): void {
    const selectedOrderIds = this.selectedProducts.map(product => product.shipping_id);

    if (selectedOrderIds.length > 0) {
      this.dialogRef = this.dialog.open(DeleteModalComponent, {
        disableClose: true,
        width: '400px',
        height: 'auto',
        data: { shippingIds: null, selectedOrderIds }
      });
      if (this.dialogRef) {
        this.dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.removeProduct = false;
            this.getOrderItems(1, this.pageSize);
          }
        });
      }
    }
  }

  nextPage() {
    if (this.pageIndex < this.totalPages - 1) {
      this.pageIndex++;
      this.getOrderItems(this.pageIndex + 1, this.pageSize);
    }
  }

  previousPage() {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.getOrderItems(this.pageIndex + 1, this.pageSize);
    }
  }
}
