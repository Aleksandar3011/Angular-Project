import { Injectable } from "@angular/core";
import { Subject } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs'

import { IAd } from "./ad.model";

@Injectable({
  providedIn: 'root'
})

export class AdsService {
  private ads: IAd[] = [];
  private adsUpdated = new Subject<IAd[]>();

  constructor(private http: HttpClient) {  }

  getAds(){
    this.http.get<{message: string, ads: any}>('http://localhost:3000/api/ads')
      .pipe(map((adData) => {
        return adData.ads.map((ad: { _id: any; title: any; about: any; }) => ({
          id: ad._id,
          title: ad.title,
          about: ad.about,
        }))
      }))
      .subscribe((transformedAds) => {
        this.ads = transformedAds;
        this.adsUpdated.next([...this.ads]);
      });
  }

  getAdUpdateListener() {
    return this.adsUpdated.asObservable()
  }

  addAd(title: string, about: string){
    const ad: IAd = {id: null, title: title, about: about};
    this.http.post<{message: string, adId: string}>('http://localhost:3000/api/ads', ad)
      .subscribe((responseData) => {
        const id = responseData.adId;
        ad.id = id;
        this.ads.push(ad)
        this.adsUpdated.next([...this.ads]);
      });
  }

  deleteAd(adId: string) {
    this.http.delete('http://localhost:3000/api/ads/' + adId)
      .subscribe(() => {
        const updatedAd = this.ads.filter(ad => ad.id !== adId);
        this.ads = updatedAd;
        this.adsUpdated.next([...this.ads])
      })
  }


}

