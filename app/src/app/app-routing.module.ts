import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdCreateComponent } from './ad/ad-create/ad-create.component';
import { AdListComponent } from './ad/ad-list/ad-list.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AboutComponent } from './core/about/about.component';
import { MainComponent } from './core/main/main.component';
import { NotFoundComponent } from './core/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    pathMatch:'full',
    component: MainComponent
  },
  {
    path: 'about',
    component: AboutComponent    
  },
  {
    path: 'auth/login',
    component: LoginComponent    
  },
  {
    path: 'auth/register',
    component: RegisterComponent    
  },
  {
    path: 'ad/dashboard',
    component: AdListComponent 
  },
  {
    path: 'ad/create',
    component: AdCreateComponent    
  },
  { path: '**',
    pathMatch: 'full',
    component: NotFoundComponent 
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }