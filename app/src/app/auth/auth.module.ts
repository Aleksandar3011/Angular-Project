import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AngularMaterialModule } from '../angular-material.module';
import { AuthInterceptor } from './auth-interceptor';



@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  exports: [
    LoginComponent,
    SignupComponent,
  ]
})
export class AuthModule { }
