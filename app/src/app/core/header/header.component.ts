import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{

  userIsAuth = false;
  private authListenerSubs!: Subscription;

  constructor(private authService: AuthService) {  }

  ngOnInit(): void {
    this.userIsAuth = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener()
    .subscribe(isAuth => {
      this.userIsAuth = isAuth;
    });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {

  }
}
