import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { DeleteModalComponent } from '../components/delete-modal/delete-modal.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SelectProductsComponent } from '../components/select-products/select-products.component';


@NgModule({
  declarations: [DeleteModalComponent, SelectProductsComponent],
  exports: [DeleteModalComponent, SelectProductsComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatSnackBarModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgSelectModule
  ]
})
export class SharedModule { }
