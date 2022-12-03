import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdListComponent } from './ad-list/ad-list.component';
import { AdCreateComponent } from './ad-create/ad-create.component';
import { AdEditComponent } from './ad-edit/ad-edit.component';
import { AdDetailComponent } from './ad-detail/ad-detail.component';
import { AngularMaterialModule } from '../angular-material.module';



@NgModule({
  declarations: [
    AdListComponent,
    AdCreateComponent,
    AdEditComponent,
    AdDetailComponent
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
  ],
  exports: [
    AdListComponent,
    AdCreateComponent,
    AdEditComponent,
    AdDetailComponent
  ]
})
export class AdModule { }
