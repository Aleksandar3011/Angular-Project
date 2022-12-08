import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'

import { AdListComponent } from './ad-list/ad-list.component';
import { AdCreateComponent } from './ad-create/ad-create.component';

import { AngularMaterialModule } from '../angular-material.module';
import { RouterModule } from '@angular/router';
// import { MatPaginator } from '@angular/material/paginator';



@NgModule({
  declarations: [
    AdListComponent,
    AdCreateComponent,

  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    // MatPaginator,
    RouterModule,
  ]
})
export class AdModule { }
