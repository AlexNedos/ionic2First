import { Component } from '@angular/core';

import { NavController, ActionSheetController, AlertController, ToastController } from 'ionic-angular';
import { Http } from '@angular/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
    public http: Http,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController
  ) { }
  items = [];
  page = 1;
  categoryType = '';


  presentAlert(bb) {
    let alert = this.alertCtrl.create({
      title: 'Low battery',
      subTitle: bb,
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
  // 400 - при скроле пусто
  // 429 - нет картинок по запросу
  // пустой статус - нет инета
  presentToast(status) {
     console.log(status)
     var error;
     if (status === 400) {
         error = 'No more result'
     } else if (status === null) {
        error = 'No results'
     } else if (status === 0) {
         error = 'No internet connection'
     } else if (status === undefined) {
         error = 'Please enter something in the search'
     }
      let toast = this.toastCtrl.create({
       message: error,
       duration: 3000,
       position: 'top'
      });
      toast.present();
    }
  logForm(data, category) {
     if (data === undefined) {
         this.presentToast(data)
     } else {
        this.categoryUndefined(category);
        this.page = 1;
        let API_KEY = '2683000-931909b1d6f29b69f89649b0a';
        let link = 'https://pixabay.com/api/?key=' + API_KEY + '&q=' + encodeURIComponent(data) + '&image_type=photo&pretty=true&page=1' + this.categoryType;
        this.http.get(link)
          .subscribe(data => {
            let dataParse = data.json();
            this.items = [];
            if (dataParse.total === 0) {
                this.presentToast(null)
            } else {
               this.items = [];
               for (var i = 0; i < dataParse.hits.length; i++) {
                 this.items.push(dataParse.hits[i].webformatURL);
               }
            }
          }, error => {
             console.log(error)
            this.presentToast(error.status)
          });
     }

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
              console.log(error)
             this.presentToast(error.status)
          });
        infiniteScroll.complete();
      }, 500);
    } else {
      infiniteScroll.complete();
    }

  }


}
