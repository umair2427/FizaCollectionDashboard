import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { skipWhile, take } from 'rxjs';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { OrderService } from 'src/app/shared/service/order/order.service';
import { ProductService } from 'src/app/shared/service/product/product.service';
import { EditOrderComponent } from '../model/edit-order/edit-order.component';

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
  paymentMethod: string[] = ['COD', 'Bank Transfer'];
  originalData: any[] = [];

  page: number = 1;
  pageSize = 10;
  pageIndex: number = 0;
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
    this.getOrderItems();
  }
  displayedColumns: string[] = [
    'order_id',
    'order_date',
    'amount',
    'paymentMethod',
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
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    if (!filterValue) {
      this.dataSource.filter = '';
      return;
    }

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return data.orderId.toLowerCase().includes(filter);
    };

    this.dataSource.filter = filterValue;
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

  applyFilters(event: any, data: any[]) {
    const filterValue = event || '';

    if (!filterValue.trim()) {

      this.dataSource.data = [...data];
    } else {

      this.dataSource.data = data.filter((order: any) => {
        return order.paymentMethod === filterValue;
      });
    }
  }


  getOrderItems() {
    this.orderService.getOrders(this.page, this.pageSize).pipe(skipWhile(val => !val), take(1)).subscribe(
      (response) => {
        this.originalData = response.orders;
        this.dataSource.data = this.originalData;
        this.totalItems = response.pagination.totalOrders;
      },
      (error) => {
        console.error(error);
      }
    );
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
          this.getOrderItems();
        }
      });
    }
  }

  openEditDialog(order: any) {
    const dialogRef = this.dialog.open(EditOrderComponent, {
      disableClose: true,
      width: '50%',
      height: 'auto',
      data: { order }
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getOrderItems();
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
            this.getOrderItems();
          }
        });
      }
    }
  }

  nextPage() {
    if (this.pageIndex < this.totalPages - 1) {
      this.page++;
      this.pageIndex++;
      this.getOrderItems();
    }
  }

  previousPage() {
    if (this.pageIndex > 0) {
      this.page--;
      this.pageIndex--;
      this.getOrderItems();
    }
  }
}
