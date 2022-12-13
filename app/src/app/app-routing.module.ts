import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { AdCreateComponent } from './ad/ad-create/ad-create.component';
import { AdListComponent } from './ad/ad-list/ad-list.component';
import { AuthGuard } from './auth/auth.guard';
import { BlogCreateComponent } from './blog/blog-create/blog-create.component';
import { BlogListComponent } from './blog/blog-list/blog-list.component';

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
    path: 'ad/dashboard',
    component: AdListComponent
  },
  {
    path: 'ad/create',
    component: AdCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit/:adId',
    component: AdCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'blog/dashboard',
    component: BlogListComponent
  },
  {
    path: 'blog/create',
    component: BlogCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit/:blogId',
    component: BlogCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  { path: '**',
    pathMatch: 'full',
    component: NotFoundComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
