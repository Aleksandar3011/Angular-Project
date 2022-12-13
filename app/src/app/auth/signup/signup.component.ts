import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy{
  isLoading = false
  private authStatusSub!: Subscription;


  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    )
  }

  onSignup(form: NgForm) {
    if(form.invalid){
      return;
    }
    if(form.value.password != form.value.repeatPassword){
      alert('Password dont\'t match!');
      return;
    }
    this.isLoading = true
    this.authService.createUser(form.value.email, form.value.password)
  }

  toLoginPage() {
    this.router.navigate(["auth/login"])
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
