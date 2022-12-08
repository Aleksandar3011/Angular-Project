import { NgModel } from "@angular/forms";
import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";

const routes: Routes = [
  {
    path: 'auth/login',
    component: LoginComponent
  },
  {
    path: 'auth/signup',
    component: SignupComponent
  },
]

@NgModel({
  imports: [

  ]
})

export class AuthRoutingModule{}
