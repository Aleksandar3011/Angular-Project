import { Component } from '@angular/core';
import { NgForm } from '@angular/forms'

import { AdsService } from '../ads.service';

@Component({
  selector: 'app-ad-create',
  templateUrl: './ad-create.component.html',
  styleUrls: ['./ad-create.component.css']
})
export class AdCreateComponent {
  enteredTitle = ``;
  enteredAboutUs = ``;

  constructor(public adsService: AdsService) {  }

  onAddAd(form: NgForm) {
    if(form.invalid){
      return;
    }

    this.adsService.addAd(form.value.title, form.value.about)
    form.resetForm();
  }
}
