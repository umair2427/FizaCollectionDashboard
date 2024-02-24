import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guard/auth.guard';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./view/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'products',
    loadChildren: () => import('./view/products/products/products.module').then(m => m.ProductsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'product-details/:id',
    loadChildren: () => import('./view/products/product-details/product-details.module').then(m => m.ProductDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'add-product',
    loadChildren: () => import('./view/products/add-product/add-product.module').then(m => m.AddProductPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'update-product/:id',
    loadChildren: () => import('./view/products/update-product/update-product.module').then(m => m.UpdateProductPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'orders',
    loadChildren: () => import('./view/orders/orders/orders.module').then(m => m.OrdersPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'order-details/:id',
    loadChildren: () => import('./view/orders/order-details/order-details.module').then(m => m.OrderDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'create-order',
    loadChildren: () => import('./view/orders/create-order/create-order.module').then(m => m.CreateOrderPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-orders',
    loadChildren: () => import('./view/orders/edit-orders/edit-orders.module').then(m => m.EditOrdersPageModule),
    canActivate: [AuthGuard]
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
