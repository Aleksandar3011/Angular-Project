import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http'
import { Router } from "@angular/router";

import { Subject } from 'rxjs'
import { map } from 'rxjs'

import { environment } from "src/environments/environment";
import { IAd } from "./ad.model";

const BACKEND_URL = environment.apiUrl + '/ads/';

@Injectable({
  providedIn: 'root'
})

export class AdsService {
  private ads: IAd[] = [];
  private adsUpdated = new Subject<{ ads: IAd[]; adsCount: number}>();

  constructor(private http: HttpClient, private router: Router) {  }

  getAds(adsPerPage: number, currentAd: number){
    const queryParams = `?pagesize=${adsPerPage}&page=${currentAd}`;
    this.http.get<{message: string, ads: any, maxAds: number}>(BACKEND_URL + queryParams)
      .pipe(map((adData) => {
        return { ads: adData.ads.map((ad: { _id: any; title: any; itField: any; tech: any; about: any; weOffer: any; ifYouHave: any; imagePath: any; creator: any}) => ({
          id: ad._id,
          title: ad.title,
          tech: ad.tech,
          itField: ad.itField,
          about: ad.about,
          weOffer: ad.weOffer,
          ifYouHave: ad.ifYouHave,
          imagePath: ad.imagePath,
          creator: ad.creator
        })), maxAds: adData.maxAds}
      }))
      .subscribe((transformedAdsData) => {
        this.ads = transformedAdsData.ads;
        this.adsUpdated.next({ads:[...this.ads], adsCount: transformedAdsData.maxAds});
      });
  }

  getAdUpdateListener() {
    return this.adsUpdated.asObservable()
  }

  getAd(id: string) {
    return this.http.get<{_id: string, title: string, tech: string, itField: string, about: string, weOffer: string, ifYouHave: string, imagePath: string, creator: string}>(`http://localhost:3000/api/ads/` + id);
  }

  addAd(title: string, tech: string, itField: string, about: string, weOffer: string, ifYouHave: string, image: string){
    // const ad: IAd = {id: null, title: title, tech: tech, itField: itField, about: about, };
    const adData = new FormData();
    adData.append("title", title);
    adData.append("tech", tech);
    adData.append("itField", itField);
    adData.append("about", about);
    adData.append("weOffer", weOffer);
    adData.append("ifYouHave", ifYouHave);
    adData.append("image", image, title);
    this.http.post<{message: string, ad: IAd}>(BACKEND_URL, adData)
      .subscribe((responseData) => {
        this.router.navigate(["ad/dashboard"])

      });
  }


  updateAd(id: string, title: string, tech: string, itField: string, about: string, weOffer: string, ifYouHave: string, image: string | undefined) {

    let adData: IAd | FormData;
    if (typeof image === "object") {
      adData = new FormData();
      adData.append("id", id);
      adData.append("title", title);
      adData.append("tech", tech);
      adData.append("itField", itField);
      adData.append("about", about);
      adData.append("weOffer", weOffer);
      adData.append("ifYouHave", ifYouHave);
      adData.append("image", image, title);
    } else {
      adData = {
        id: id,
        title: title,
        tech: tech,
        itField: itField,
        about: about,
        weOffer: weOffer,
        ifYouHave: ifYouHave,
        imagePath: image,
        creator: null
      };
    }
    this.http.put(BACKEND_URL + id, adData)
      .subscribe(response => {
        this.router.navigate(["ad/dashboard"])
      });
  }

  deleteAd(adId: string) {
   return this.http.delete(BACKEND_URL + adId)
  }


}

