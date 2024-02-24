import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Product } from 'src/app/shared/service/product/Product';
import { ProductService } from 'src/app/shared/service/product/product.service';
import { Router } from '@angular/router';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  dialogRef!: MatDialogRef<DeleteModalComponent>;
  displayedColumns: string[] = [
    'check',
    'name',
    'price',
    'createdAt',
    'action',
  ];
  dataSource = new MatTableDataSource<Product>();
  pageSize: number = 10;
  pageIndex:number = 0;
  totalItems: number = 0;
  radioPrice = null;
  radioDiscount = null;
  showDiscount: boolean = true;
  viewAction: boolean = false;
  removeProduct: boolean = false;

  selectedProducts: Product[] = [];

  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  filteredProducts: any;
  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private cdRef: ChangeDetectorRef,
    private productService: ProductService,
    private router: Router,
    public dialog: MatDialog,
  ) { }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;

    this.dataSource.paginator = this.paginator;
    this.cdRef.detectChanges();
  }
  ngOnInit() {
    this.getProducts(1, this.pageSize);
  }

  // ionViewWillEnter(): void {
  //   this.getProducts(1, this.pageSize);
  // }

  getProducts(page: number, pageSize: number): void {
    this.productService.getProducts(page, pageSize).subscribe(
      (data) => {
        this.dataSource.data = data.products;
        this.totalItems = data.totalCount;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  openDialog(productId: number) {
    this.dialogRef = this.dialog.open(DeleteModalComponent, {
      disableClose: true,
      width: '400px',
      height: 'auto',
      data: { productId }
    });
    if (this.dialogRef) {
      this.dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getProducts(1, this.pageSize);
        }
      });
    }
  }

  navigateToProductDetail(productId?: number, url?: string) {
    if (productId) {
      const selectedProduct = this.dataSource.data.find(product => product.id === productId);

      if (selectedProduct) {
        if (url === 'update-product') {
          this.productService.setSelectedProduct(selectedProduct);
        }
        this.router.navigate([url, productId]);
      } else {
        console.error('Product not found');
      }
    } else {
      console.error('Product ID is undefined');
    }
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

  priceFilter(event: any) {
    const selectedPrice = parseInt(event.target.value);
    const customPriceFilter = (data: Product, filter: number) => {
      return (
        data.productPrice !== undefined &&
        data.productPrice >= filter &&
        data.productPrice < filter + 500
      );
    };
    this.dataSource.filterPredicate = (data, filter) => {
      return customPriceFilter(data, parseInt(filter));
    };
    this.dataSource.filter = selectedPrice.toString();
  }

  discountFilter(event: any) {
    const selectedDiscount = parseInt(event.target.value);
    const customDiscountFilter = (data: Product, filter: number) => {
      return (
        data.productDiscount !== undefined &&
        data.productDiscount >= filter &&
        data.productDiscount < filter + 10
      );
    };
    this.dataSource.filterPredicate = (data, filter) => {
      return customDiscountFilter(data, parseInt(filter));
    };
    this.dataSource.filter = selectedDiscount.toString();
  }


  changeSelect(product: Product) {
    if (this.isSelected(product)) {
      this.selectedProducts = this.selectedProducts.filter(
        (selectedProduct) => selectedProduct.id !== product.id
      );
    } else {
      this.selectedProducts.push(product);
    }
    this.removeProduct = this.selectedProducts.length > 0;
  }

  removeSelectedProducts(): void {
    const selectedProductIds = this.selectedProducts.map(product => product.id);

    if (selectedProductIds.length > 0) {
      this.dialogRef = this.dialog.open(DeleteModalComponent, {
        disableClose: true,
        width: '400px',
        height: 'auto',
        data: { productIds: null, selectedProductIds }
      });
      if (this.dialogRef) {
        this.dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.removeProduct = false;
            this.getProducts(1, this.pageSize);
          }
        });
      }
    }
  }

  isSelected(product: Product): boolean {
    return this.selectedProducts.some(
      (selectedProduct) => selectedProduct.id === product.id
    );
  }

  nextPage() {
    if (this.pageIndex < this.totalPages - 1) {
      this.pageIndex++;
      this.getProducts(this.pageIndex + 1, this.pageSize);
    }
  }

  previousPage() {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.getProducts(this.pageIndex + 1, this.pageSize);
    }
  }

  reset() {
    this.dataSource.filter = '';
    this.radioPrice = null;
    this.radioDiscount = null;
  }
}
