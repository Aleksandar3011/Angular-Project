import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http'
import { Router } from "@angular/router";

import { Subject } from 'rxjs'
import { map } from 'rxjs'

import { IAd } from "./ad.model";

@Injectable({
  providedIn: 'root'
})

export class AdsService {
  private ads: IAd[] = [];
  private adsUpdated = new Subject<IAd[]>();

  constructor(private http: HttpClient, private router: Router) {  }

  getAds(){
    this.http.get<{message: string, ads: any}>('http://localhost:3000/api/ads')
      .pipe(map((adData) => {
        return adData.ads.map((ad: { _id: any; title: any; itField: any; tech: any; about: any; }) => ({
          id: ad._id,
          title: ad.title,
          tech: ad.tech,
          itField: ad.itField,
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

  getAd(id: string) {
    return this.http.get<{_id: string, title: string, tech: string, itField: string, about: string}>(`http://localhost:3000/api/ads/` + id);
  }

  addAd(title: string, tech: string, itField: string, about: string){
    const ad: IAd = {id: null, title: title, tech: tech, itField: itField, about: about, };
    this.http.post<{message: string, adId: string}>('http://localhost:3000/api/ads', ad)
      .subscribe((responseData) => {
        const id = responseData.adId;
        ad.id = id;
        this.ads.push(ad)
        this.adsUpdated.next([...this.ads]);
        this.router.navigate(["ad/dashboard"])
        //I AM HERE NOW, THIS IS LAST STEP
      });
  }


  updateAd(id: string, title: string, tech: string, itField: string, about: string) {
    const ad: IAd = {id: id, title: title, tech: tech, itField: itField, about: about}
    this.http.put(`http://localhost:3000/api/ads/` + id, ad)
      .subscribe(response => {
        const updatedAd = [...this.ads];
        const oldAdIndex = updatedAd.findIndex(a => a.id == ad.id);
        updatedAd[oldAdIndex] = ad;
        this.ads = updatedAd;
        this.adsUpdated.next([...this.ads]);
        this.router.navigate(["ad/dashboard"])
        //I AM HERE NOW, THIS IS LAST STEP
        
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

