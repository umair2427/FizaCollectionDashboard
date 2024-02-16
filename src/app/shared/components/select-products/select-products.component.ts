import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../service/product/Product';
import { ProductService } from '../../service/product/product.service';

@Component({
  selector: 'app-select-products',
  templateUrl: './select-products.component.html',
  styleUrls: ['./select-products.component.scss'],
})
export class SelectProductsComponent implements OnInit {
  selectedProducts: Product[] = [];
  pageSize = 10;
  pageIndex = 0;
  displayedProducts: Product[] = [];
  totalItems = 0;
  products: Product[] = [];


  constructor(
    private dialogRef: MatDialogRef<SelectProductsComponent>,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.getProducts(1, this.pageSize);
  }

  closeModel() {
    this.dialogRef.close(this.selectedProducts);
  }

  close() {
    this.dialogRef.close('close');
  }

  isSelected(product: Product): boolean {
    return this.selectedProducts.some((p) => p.id === product.id);
  }

  toggleProductSelection(product: Product) {
    const index = this.selectedProducts.findIndex(
      (selectedProduct) => selectedProduct.id === product.id
    );
    if (index !== -1) {
      this.selectedProducts.splice(index, 1);
    } else {
      this.selectedProducts.push(product);
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  getProducts(page: number, pageSize: number): void {
    this.productService.getProducts(page, pageSize).subscribe(
      (data) => {
        this.products = data.products;
        this.totalItems = data.totalCount;
        this.displayedProducts = this.getPaginatedProducts();
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  getPaginatedProducts(): Product[] {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.products.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.pageIndex < this.totalPages - 1) {
      this.pageIndex++;
      this.displayedProducts = this.getPaginatedProducts();
    }
  }

  previousPage() {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.displayedProducts = this.getPaginatedProducts();
    }
  }
}
