import { Component } from '@angular/core';

import { NavController, ActionSheetController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-library',
  templateUrl: 'library.html'
})
export class LibraryPage {

  constructor(
    public navCtrl: NavController,
    public storage: Storage,
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
        this.library.push(elem[i])
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
                if (elem[i] === item) {
                  elem.splice(i, 1);
                  console.log(elem);
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
