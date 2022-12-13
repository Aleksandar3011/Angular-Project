import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IAd } from 'src/app/ad/ad.model';
import { environment } from "src/environments/environment";


const BACKEND_URL = environment.apiUrl + '/ads';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  ads: any = []

  last: any = {};

  lastThree: any = [];


  constructor(private http: HttpClient) {  }

  ngOnInit() {

    this.http.get(BACKEND_URL)
      .subscribe(lThree => {
        this.last = lThree
        const lastThree = this.last.ads.slice(-3)
        this.lastThree = lastThree
      });

  }
}
