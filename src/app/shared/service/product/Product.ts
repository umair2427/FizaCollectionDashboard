export interface Product {
  id?: number;
  productMainImage?: string;
  productGalleryImageOne?: string;
  productGalleryImageTwo?: string;
  productName?: string;
  categoryName?: string;
  categoryId?: number;
  productDateTime?: Date;
  productPrice?: number;
  productDiscount?: number;
  statusId?: string;
  statusName?: string;
  discountedPrice?: string;
  productDescription?: string;
  quantity?: number;
  colorName?: string;
  message?: string;
  colorId?: number;
}
