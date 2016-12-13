import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
    public http: Http,
  ) {}
  items = [];
  page = 1;
  logForm(data) {
    this.page = 1;
    let link = 'https://pixabay.com/api/?key=2683000-931909b1d6f29b69f89649b0a&q=' + data + '&image_type=photo&pretty=true&page=1';
    this.http.get(link)
      .subscribe(data => {
        let dataParse = data.json();
        this.items = [];
        for (var i = 0; i < dataParse.hits.length; i++) {
          this.items.push(dataParse.hits[i].webformatURL);
        }
      }, error => {
        console.log("Oooops!");
      });
  }

  doInfinite(infiniteScroll, data) {
  // console.log('Begin async operation');
  this.page++
  setTimeout(() => {
    //   console.log(infiniteScroll);

      let link = 'https://pixabay.com/api/?key=2683000-931909b1d6f29b69f89649b0a&q=' + data + '&image_type=photo&pretty=true&page=' + this.page;

      this.http.get(link)
        .subscribe(data => {
          let dataParse = data.json();
          for (var i = 0; i < dataParse.hits.length; i++) {
            this.items.push(dataParse.hits[i].webformatURL);
          }
        }, error => {
          console.log("Oooops!");
        });
    infiniteScroll.complete();
  }, 500);
}


}
