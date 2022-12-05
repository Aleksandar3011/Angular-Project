import { Component, OnInit, OnDestroy } from '@angular/core';
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

  constructor(public adsService: AdsService) {  }

  ngOnInit(): void {
    this.adsService.getAds();
    this.adsSub = this.adsService.getAdUpdateListener().subscribe((ads: IAd[]) => {
      this.ads = ads
    });
  }

  onDelete(adId: string) {
    this.adsService.deleteAd(adId);
  }

  ngOnDestroy(): void {
    this.adsSub.unsubscribe();
  }
}
