import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Product } from 'src/app/shared/service/product/Product';
import { ProductService } from 'src/app/shared/service/product/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage implements OnInit {
  selectedSegment = 'specification';
  productId!: string;
  product: any;
  loader: boolean = true;
  constructor(private route: ActivatedRoute,
    private productService: ProductService,) { }
  customOptions!: OwlOptions;
  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    this.fetchProductDetails();
  }

  fetchProductDetails(): void {
    this.productService.getProductById(this.productId).subscribe(
      (product: any) => {
        this.product = product.product;
        this.loader = false;
      },
      error => {
        console.error('Error fetching product details:', error);
      }
    );
  }
}
