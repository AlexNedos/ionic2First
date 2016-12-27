import { Component, ViewChild } from '@angular/core';

import { Nav, NavController, ActionSheetController, ToastController, App, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import { LibraryPage } from '../library/library';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Nav) nav: Nav;
  constructor(
    public navCtrl: NavController,
    public http: Http,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public viewCtrl: ViewController,
    public appCtrl: App,
    public storage: Storage
  ) { }
  items = [];
  library = [];
  page = 1;
  categoryType = '';

  openLibrary() {
     this.appCtrl.getRootNav().push(LibraryPage);
 }


  openPhoto(item) {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Add to library',
          role: 'destructive',
          handler: () => {
            this.storage.get('library').then((elem) => {
              if (elem === null) {
                this.library.push(item);
                this.storage.set('library', this.library).then(() => {
                });
              } else {
                 let checked = false;
                for (let i = 0; i < elem.length; i++) {
                    if (elem[i] === item) {
                        checked = true;
                    }
                }
                if (checked === false) {
                   elem.push(item);
                   this.storage.set('library', elem).then(() => {
                  });
                }
              }
            });
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
    } else if (data === '') {
      this.presentToast(undefined)
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
