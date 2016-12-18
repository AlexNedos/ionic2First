import { Component } from '@angular/core';

import { NavController, ActionSheetController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
    public http: Http,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController
  ) { }
  items = [];
  page = 1;
  categoryType = '';

  presentAlert(aa) {
    let alert = this.alertCtrl.create({
      title: 'Low battery',
      subTitle: aa,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  openPhoto() {
    let actionSheet = this.actionSheetCtrl.create({
      // title: '',
      buttons: [
        {
          text: 'Add to library',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
          }
        },
        {
          text: 'Share',
          handler: () => {
            console.log('Archive clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }

  logForm(data, category) {
    this.categoryUndefined(category);
    this.page = 1;
    let API_KEY = '2683000-931909b1d6f29b69f89649b0a';
    let link = 'https://pixabay.com/api/?key=' + API_KEY + '&q=' + encodeURIComponent(data) + '&image_type=photo&pretty=true&page=1' + this.categoryType;
    console.log(link);
    this.http.get(link)
      .subscribe(data => {
        let dataParse = data.json();
        this.items = [];
        for (var i = 0; i < dataParse.hits.length; i++) {
          this.items.push(dataParse.hits[i].webformatURL);
        }
      }, error => {

        this.presentAlert(error.status)
      //   console.log(error.status)
        console.log("Oooops!");
      });
  }

  categoryUndefined(category) {
    if (category === undefined) {
      this.categoryType = '';
    } else if (category === 'undefined') {
      this.categoryType = '';
    } else {
      this.categoryType = '&category=' + category;
    }
  }
  doInfinite(infiniteScroll, data, category) {
    this.categoryUndefined(category);
    if (this.items.length > 0) {
      this.page++
      setTimeout(() => {
        let API_KEY = '2683000-931909b1d6f29b69f89649b0a';
        let link = 'https://pixabay.com/api/?key=' + API_KEY + '&q=' + encodeURIComponent(data) + '&image_type=photo&page=' + this.page + this.categoryType;

        this.http.get(link)
          .subscribe(data => {
            let dataParse = data.json();
            for (var i = 0; i < dataParse.hits.length; i++) {
              this.items.push(dataParse.hits[i].webformatURL);
            }
          }, error => {
             this.presentAlert(error.status)
            //  console.log(error.status)
            // 400 - при скроле пусто
            // 429 - нет картинок по запросу
            // пустой статус - нет инета
            console.log("Oooops!");
          });
        infiniteScroll.complete();
      }, 500);
    } else {
      infiniteScroll.complete();
    }

  }


}
