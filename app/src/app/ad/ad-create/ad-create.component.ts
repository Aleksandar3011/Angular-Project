import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, ParamMap } from '@angular/router';

import { IAd } from '../ad.model';
import { AdsService } from '../ads.service';
import { mimeType } from "./mime-type.validator";

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
  isLoading = false;
  form!: FormGroup;
  imagePreview!: string;

  private mode = '';
  private adId: any;

  constructor(public adsService: AdsService, public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'tech': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'itField': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'about': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(10)]
      }),
      'image': new FormControl(null, {
        validators: [Validators.required], asyncValidators: [mimeType]
      }),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('adId')) {
        this.mode = 'edit';
        this.adId = paramMap.get('adId');
        this.isLoading = true;
        this.adsService.getAd(this.adId).subscribe(adData => {
          this.isLoading = false;
          this.ad = { id: adData._id, title: adData.title, tech: adData.tech, itField: adData.itField, about: adData.about, imagePath: adData.imagePath}
          this.form.setValue({ 'title': this.ad.title, 'tech': this.ad.tech, 'itField': this.ad.itField, 'about': this.ad.about, 'image': this.ad.imagePath });
        });
      } else {
        this.mode = 'create';
        this.adId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement as any).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  onSaveAd() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode == 'create') {
      this.adsService.addAd(this.form.value.title, this.form.value.tech, this.form.value.itField, this.form.value.about, this.form.value.image)
    } else {
      this.adsService.updateAd(this.adId, this.form.value.title, this.form.value.tech, this.form.value.itField, this.form.value.about, this.form.value.image);
    }
    this.form.reset();
  }
}
