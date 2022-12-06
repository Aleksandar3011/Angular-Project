import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs'

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
  isLoading = false
  totalAds = 0;
  adsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2 ,5, 10];

  constructor(public adsService: AdsService) {  }

  ngOnInit(): void {
    this.isLoading = true;
    this.adsService.getAds(this.adsPerPage, this.currentPage);
    this.adsSub = this.adsService.getAdUpdateListener()
      .subscribe((adData: {ads: IAd[]; adsCount: number}) => {
        this.isLoading = false;
        this.totalAds = adData.adsCount
        this.ads = adData.ads
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
    });
  }

  ngOnDestroy(): void {
    this.adsSub.unsubscribe();
  }
}
