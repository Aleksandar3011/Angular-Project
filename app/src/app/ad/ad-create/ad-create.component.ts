import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'
import { ActivatedRoute, ParamMap } from '@angular/router';
import { IAd } from '../ad.model';

import { AdsService } from '../ads.service';

@Component({
  selector: 'app-ad-create',
  templateUrl: './ad-create.component.html',
  styleUrls: ['./ad-create.component.css']
})
export class AdCreateComponent implements OnInit {
  enteredTitle = ``;
  enteredAboutUs = ``;

  // ad: IAd | any;

  ad: IAd | any = {} as IAd;

   private mode = '';
   private adId: any;

  constructor(public adsService: AdsService, public route: ActivatedRoute) {  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('adId')){
        this.mode = 'edit';
        this.adId = paramMap.get('adId');
        this.adsService.getAd(this.adId).subscribe(adData => {
          this.ad = {id: adData._id, title: adData.title, tech: adData.tech, itField: adData.itField, about: adData.about}
        });
      }else{
        this.mode = 'create';
        this.adId = null;
      }
    });
  }

  onSaveAd(form: NgForm) {
    if(form.invalid){
      return;
    }
    if(this.mode == 'create'){
      this.adsService.addAd(form.value.title, form.value.tech, form.value.itField, form.value.about)
    }else {
      this.adsService.updateAd(this.adId, form.value.title, form.value.tech, form.value.itField, form.value.about);
    }
    form.resetForm();
  }
}
