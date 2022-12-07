import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth.model";

@Injectable({ providedIn: 'root'})

export class AuthService {

  private token!: string | any;
  private authStatusListener = new Subject<boolean>();
  private isAuth = false;
  private tokenTimer!: NodeJS.Timer;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth () {
    return this.isAuth
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post("http://localhost:3000/api/user/signup", authData)
      .subscribe(response => {
        console.log(response);
      });
  }

  login(email:string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post<{token: string, expiresIn: number}>("http://localhost:3000/api/user/login", authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if(token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuth = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          console.log(expirationDate);

          this.saveAuthData(token, expirationDate)
          this.router.navigate(['/']);
        }
      });
  };

  autoAuthUser() {
    const authInfo: any = this.getAuthDate();
    if(!authInfo){
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0) {
      this.token = authInfo.token;
      this.isAuth = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuth = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer:" + duration);

    this.tokenTimer = setTimeout(() => {
      this.logout()
    }, duration * 1000);
  }

  private saveAuthData(token: string, expansionDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expansionDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration")
  }

  private getAuthDate() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if(!token || !expirationDate){
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }
}
