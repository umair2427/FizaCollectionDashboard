import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditOrdersPageRoutingModule } from './edit-orders-routing.module';

import { EditOrdersPage } from './edit-orders.page';
import {MatDialogModule} from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EditOrdersPageRoutingModule,
    MatDialogModule,
    SharedModule,
    NgSelectModule
  ],
  declarations: [EditOrdersPage]
})
export class EditOrdersPageModule {}
