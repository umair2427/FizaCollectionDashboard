import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Observable, skipWhile, take } from 'rxjs';
import { CloudinaryUploadService } from 'src/app/shared/service/cloudinary/cloudinary.service';
import { ProductService } from 'src/app/shared/service/product/product.service';

interface items {
  id?: number;
  name?: string;
}

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.page.html',
  styleUrls: ['./update-product.page.scss'],
})
export class UpdateProductPage implements OnInit {
  profile_preview: any = '';
  gallerySrcOne: any;
  gallerySrcTwo: any;

  is_not_image_message = '';
  is_not_image_message1 = '';
  is_not_image_message2 = '';
  productId!: string;
  public message: string = '';
  public color: string = 'success';

  isImage: boolean[] = [true, true];
  isImage1: boolean[] = [true, true];
  isImage2: boolean[] = [true, true];
  loader: boolean = false;

  filesToUpload: Array<File> = [];
  isLoading$!: Observable<boolean>;

  images: string[] = [];
  selectedColors: string[] = [];

  hoveredCard: number = -1;
  maxImages: number = 5;

  categories: string[] = ['Top', '2 Piece Suit', '3 Piece Suit', 'Flapper', 'Jeans', 'Capri', 'Trouser', 'Lehnga', 'Dupatta', 'Thigts'];
  status: string[] = ['Published', 'Draft'];

  editProductForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastController: ToastController,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private cloudinaryService: CloudinaryUploadService
  ) { }

  ngOnInit() {
    this.editProductForm = this.fb.group({
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

    this.isLoading$ = this.productService.isLoading$;
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    this.productService.getProductById(this.productId).pipe(skipWhile(val => !val), take(1)).subscribe(
      res => {
        if (res) {
          this.onUpdate(res?.product);
        }
      }
    )
  }


  onUpdate(res: any) {
    this.editProductForm.patchValue({
      productName: res?.productName,
      productDescription: res?.productDescription,
      productDateTime: res?.productDateTime,
      category: res?.category,
      productPrice: res?.productPrice,
      productDiscount: res?.productDiscount,
      status: res?.status,
      productMainImage: res?.productMainImage,
    });
    this.profile_preview = res?.productMainImage;
    this.images = res.productGalleryImages

    this.patchSelectedColors(res.colors);
  }

  greaterThanZeroWithoutLeadingZero(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    const valueString = typeof value === 'number' ? value.toString() : value;

    if (valueString === null || valueString === '' || (Number(valueString) > 0 && valueString.charAt(0) !== '0')) {
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
    return this.editProductForm.controls;
  }

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '10rem',
    minHeight: '5rem',
    placeholder: 'Enter description here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    toolbarHiddenButtons: [
      ['strikeThrough'],
      [
        'backgroundColor',
        'customClasses',
        'unlink',
        'insertImage',
        'insertVideo',
      ],
    ],
  };
  uploadImage(event: any, identifier: string): void {
    const file = event.target.files[0];
    this.handleImage(file, identifier, 0);
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
        }
      };

      reader.readAsDataURL(file);
      this.editProductForm.get(identifier)?.patchValue(file);

    } else {
      if (identifier === 'productMainImage') {
        this.isImage[0] = false;
        this.profile_preview = null;
      }
      this.editProductForm.get(identifier)?.setValue(null);
      if (!file) {
        this.is_not_image_message = 'No image file selected';
      } else {
        this.is_not_image_message = 'Only JPEG, JPG, and PNG file formats are allowed';
      }
    }
  }

  onColorChange(event: any, color: string) {
    if (event.target.checked) {
      this.selectedColors.push(color);
    } else {
      this.selectedColors = this.selectedColors.filter(c => c !== color);
    }
  }

  patchSelectedColors(colors: string[]) {
    this.selectedColors = colors;
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;

    if (this.images.length + files.length > this.maxImages) {
      alert(`You can only add maximum 5 images.`);
      return;
    }

    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.images.push(e.target.result);
        };

        reader.readAsDataURL(file);
      }
    }
  }


  removeImage(index: number) {
    this.images.splice(index, 1);
  }

  async getProductFormValue() {
    if (this.editProductForm.invalid) {
      // Mark all form controls as touched to display the validation errors
      Object.values(this.editProductForm.controls).forEach(control => {
        control.markAsTouched();
      });
      this.message = 'Input fields are invalid';
      this.color = 'danger';
      this.presentToast('top');
    } else {
      this.loader = true;
      let productMainImage;
      if (this.profile_preview.startsWith('data')) {
        productMainImage = await this.cloudinaryService.uploadFiles(this.editProductForm.get('productMainImage')?.value, 'product');
      }

      const productGalleryImages: string[] = [];
      const nonDataImages: string[] = [];

      const allDataImages = this.images.every(image => image.startsWith('data'));

      if (allDataImages) {
        for (let i = 0; i < this.images.length; i++) {
          const uploadedImage = await this.cloudinaryService.uploadFiles(this.images[i], 'product');
          productGalleryImages.push(uploadedImage.secure_url);
        }
      } else {
        for (let i = 0; i < this.images.length; i++) {
          if (this.images[i].startsWith('data')) {
            const uploadedImage = await this.cloudinaryService.uploadFiles(this.images[i], 'product');
            productGalleryImages.push(uploadedImage.secure_url);
          } else {
            nonDataImages.push(this.images[i]);
          }
        }
      }
      const combineImages = productGalleryImages.concat(nonDataImages);
      this.loader = false;
      let payload =
      {
        productMainImage: productMainImage?.secure_url ? productMainImage?.secure_url : this.profile_preview,
        productGalleryImages: combineImages,
        productName: this.editProductForm.get('productName')?.value,
        productDescription: this.editProductForm.get('productDescription')?.value,
        productPrice: this.editProductForm.get('productPrice')?.value,
        category: this.editProductForm.get('category')?.value,
        status: this.editProductForm.get('status')?.value,
        productDiscount: this.editProductForm.get('productDiscount')?.value,
        productDateTime: this.editProductForm.get('productDateTime')?.value,
        colors: this.selectedColors
      }

      this.productService.updateProduct(this.productId, payload).subscribe(
        response => {
          this.message = response.message || '';
          this.color = 'success';
          this.presentToast('top');
          this.editProductForm.reset();
          this.router.navigate(['products']);
        },
        error => {
          console.error('Error:', error);
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
