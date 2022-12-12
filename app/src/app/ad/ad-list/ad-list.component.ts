import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs'
import { AuthService } from 'src/app/auth/auth.service';

import { IAd } from '../ad.model';
import { AdsService } from '../ads.service';

@Component({
  selector: 'app-ad-list',
  templateUrl: './ad-list.component.html',
  styleUrls: ['./ad-list.component.css']
})
export class AdListComponent implements OnInit, OnDestroy {

  ads: IAd[] = []
  private adsSub!: Subscription;
  private authStatusSub!: Subscription;
  isLoading = false
  totalAds = 0;
  adsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2 ,5, 10];
  userIsAuth = false;
  userId!: string;

  constructor(public adsService: AdsService, private authService: AuthService) {  }

  ngOnInit(): void {
    this.isLoading = true;
    this.adsService.getAds(this.adsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.adsSub = this.adsService.getAdUpdateListener()
      .subscribe((adData: {ads: IAd[]; adsCount: number}) => {
        this.isLoading = false;
        this.totalAds = adData.adsCount
        this.ads = adData.ads
    });
    this.userIsAuth = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener()
    .subscribe(isAuth => {
      this.userIsAuth = isAuth;
      this.userId = this.authService.getUserId();
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.adsPerPage = pageData.pageSize;
    this.adsService.getAds(this.adsPerPage, this.currentPage);

  }

  onDelete(adId: string) {
    this.isLoading = true;
    this.adsService.deleteAd(adId).subscribe(() => {
      this.adsService.getAds(this.adsPerPage, this.currentPage)
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    this.adsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
