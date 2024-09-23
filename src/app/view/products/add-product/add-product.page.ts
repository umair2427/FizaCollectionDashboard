import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ToastController } from '@ionic/angular';
import { CloudinaryUploadService } from 'src/app/shared/service/cloudinary/cloudinary.service';
import { ProductService } from 'src/app/shared/service/product/product.service';


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {
  profile_preview: any = '';
  gallerySrcOne: any;
  gallerySrcTwo: any;

  is_not_image_message = '';
  is_not_image_message1 = '';
  is_not_image_message2 = '';
  public color: string = 'success';
  public message: string = '';

  isImage: boolean[] = [true, true];
  isImage1: boolean[] = [true, true];
  isImage2: boolean[] = [true, true];
  filesToUpload: Array<File> = [];
  categories: string[] = ['Top', '2 Piece Suit', '3 Piece Suit', 'Flapper', 'Jeans', 'Capri', 'Trouser', 'Lehnga', 'Dupatta', 'Thigts'];
  status: string[] = ['Published', 'Draft'];

  loader: boolean = false;

  public Editor: any = ClassicEditor;

  addProductForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastController: ToastController,
    private productService: ProductService,
    private router: Router,
    private cloudinaryService: CloudinaryUploadService
  ) { }

  ngOnInit() {
    this.addProductForm = this.fb.group({
      productName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      productDescription: ['', [Validators.required]],
      productMainImage: [null, [Validators.required]],
      productGalleryImageOne: [null, [Validators.required]],
      productGalleryImageTwo: [null, [Validators.required]],
      productDateTime: [
        '',
        [Validators.required],
      ],
      category: [null, [Validators.required]],
      productPrice: ['', [Validators.required, this.greaterThanZeroWithoutLeadingZero]],
      productDiscount: [
        '',
        [Validators.required,
        this.discountValueValidator
        ],
      ],
      status: [null, [Validators.required]]
    });

  }
  greaterThanZeroWithoutLeadingZero(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (value === null || value === '' || (Number(value) > 0 && value.charAt(0) !== '0')) {
      return null;
    } else {
      return { greaterThanZeroWithoutLeadingZero: true };
    }
  }

  discountValueValidator(control: AbstractControl): { [key: string]: any } | null {
    const discount = control.value;
    if (discount !== null && (isNaN(discount) || discount < 0 || discount > 100)) {
      return { invalidDiscount: true };
    }
    return null;
  }

  get f() {
    return this.addProductForm.controls;
  }

  uploadImage(event: any, identifier: string): void {
    const file = event.target.files[0];
    this.handleImage(file, identifier, 0);
  }

  galleryOne(event: any, identifier: string): void {
    const file = event.target.files[0];
    this.handleImage(file, identifier, 1);
  }

  galleryTwo(event: any, identifier: string): void {
    const file = event.target.files[0];
    this.handleImage(file, identifier, 2);
  }

  private handleImage(file: File, identifier: string, index: number): void {
    const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];

    if (file && allowedFormats.includes(file.type)) {
      const reader = new FileReader();

      reader.onload = (_event: any) => {
        this.is_not_image_message = '';
        if (identifier === 'productMainImage') {
          this.isImage[0] = true;
          this.profile_preview = _event.target.result;
        } else if (identifier === 'productGalleryImageOne') {
          this.isImage1[0] = true;
          this.gallerySrcOne = _event.target.result;
        } else if (identifier === 'productGalleryImageTwo') {
          this.isImage2[0] = true;
          this.gallerySrcTwo = _event.target.result;
        }
      };

      reader.readAsDataURL(file);
      this.addProductForm.get(identifier)?.patchValue(file);

    } else {
      if (identifier === 'productMainImage') {
        this.isImage[0] = false;
        this.profile_preview = null;
      } else if (identifier === 'productGalleryImageOne') {
        this.isImage1[0] = false;
        this.gallerySrcOne = null;
      } else if (identifier === 'productGalleryImageTwo') {
        this.isImage2[0] = false;
        this.gallerySrcTwo = null;
      }
      this.addProductForm.get(identifier)?.setValue(null);
      if (!file) {
        this.is_not_image_message = 'No image file selected';
      } else {
        this.is_not_image_message = 'Only JPEG, JPG, and PNG file formats are allowed';
      }
    }
  }

  async getProductFormValue() {
    if (this.addProductForm.invalid) {
      // Mark all form controls as touched to display the validation errors
      Object.values(this.addProductForm.controls).forEach(control => {
        control.markAsTouched();
      });
      this.message = 'Input fields are invalid';
      this.color = 'danger';
      this.presentToast('top');
    } else {
      this.loader = true;
      const productMainImage = await this.cloudinaryService.uploadFiles(this.addProductForm.get('productMainImage')?.value, 'product');
      const productGalleryImageOne = await this.cloudinaryService.uploadFiles(this.addProductForm.get('productGalleryImageOne')?.value, 'product');
      const productGalleryImageTwo = await this.cloudinaryService.uploadFiles(this.addProductForm.get('productGalleryImageTwo')?.value, 'product');

      let payload =
      {
        productMainImage: productMainImage.secure_url,
        productGalleryImageOne: productGalleryImageOne.secure_url,
        productGalleryImageTwo: productGalleryImageTwo.secure_url,
        productName: this.addProductForm.get('productName')?.value,
        productDescription: this.addProductForm.get('productDescription')?.value,
        productPrice: this.addProductForm.get('productPrice')?.value,
        category: this.addProductForm.get('category')?.value,
        status: this.addProductForm.get('status')?.value,
        productDiscount: this.addProductForm.get('productDiscount')?.value,
        productDateTime: this.addProductForm.get('productDateTime')?.value
      }

      this.productService.addProducts(payload).subscribe(
        response => {
          if (response) {
            this.loader = false;
            this.message = response.message || '';
            this.color = 'success';
            this.presentToast('top');
            this.addProductForm.reset();
            this.router.navigate(['products']);
          }
        },
        error => {
          console.error('Error:', error);
          this.loader = false;
          this.message = error;
          this.color = 'danger';
          this.presentToast('top');
        }
      )
    }
  }

  numberOnly(event: any): boolean {
    const inputChar = String.fromCharCode(event.which ? event.which : event.keyCode);
    if (!/^\d*\.?\d*$/.test(inputChar)) {
      return false;
    }

    return true;
  }

  async presentToast(position: 'top') {
    const toast = await this.toastController.create({
      message: this.message,
      duration: 1500,
      position: position,
      color: this.color,
      cssClass: ['text-center'],
    });
    await toast.present();
  }
}
