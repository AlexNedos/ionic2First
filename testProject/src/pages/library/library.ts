import { Component } from '@angular/core';

import { NavController, ActionSheetController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';

@Component({
  selector: 'page-library',
  templateUrl: 'library.html'
})
export class LibraryPage {

  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public http: Http,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController

  ) { }
  library = [];

  ngOnInit() {
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    this.storage.get('library').then((elem) => {
      this.library = [];
      for (let i = 0; i < elem.length; i++) {
        let API_KEY = '2683000-931909b1d6f29b69f89649b0a';
        let link = 'https://pixabay.com/api/?key=' + API_KEY + '&id=' + elem[i];
        this.http.get(link)
          .subscribe(data => {
            let dataParse = data.json();
            this.library.push(dataParse.hits[0]);
          }, error => {
            console.log(error)
          });
      }
      loader.dismiss()
      console.log(this.library)
    });
  }

  openPhoto(item) {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Remove from library',
          role: 'destructive',
          handler: () => {
            this.storage.get('library').then((elem) => {
              for (let i = 0; i < elem.length; i++) {
                if (elem[i] === item.id) {
                  elem.splice(i, 1);
                  this.storage.set('library', elem).then(() => {
                    this.ngOnInit();
                  });
                  break;
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

}
