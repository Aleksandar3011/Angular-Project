import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from "./core/core.module";
import { AngularMaterialModule } from './angular-material.module';
import {MatDialogModule} from '@angular/material/dialog';
import { BlogModule } from './blog/blog.module';
import { AdModule } from './ad/ad.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';


@NgModule({
    declarations: [
        AppComponent,
        ErrorComponent
    ],
    providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
                {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}],
    bootstrap: [AppComponent],
    imports: [
      BrowserModule,
      AppRoutingModule,
      AngularMaterialModule,
      BrowserAnimationsModule,
      AdModule,
      BlogModule,
      CoreModule,
      MatDialogModule,

    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    entryComponents: [ErrorComponent]
})
export class AppModule { }
