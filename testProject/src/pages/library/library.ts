import { Component } from '@angular/core';

import { NavController, ActionSheetController, LoadingController, ToastController, AlertController, App, Platform, ModalController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import { StatusBar } from 'ionic-native';
import { VideoContainerPage } from '../videoContainer/videoContainer';



@Component({
  selector: 'page-library',
  templateUrl: 'library.html'
})
export class LibraryPage {


  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public http: Http,
    public appCtrl: App,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    public platform: Platform


  ) {
     platform.ready().then(() => {
     setTimeout(() => {
     StatusBar.overlaysWebView(true);
     StatusBar.backgroundColorByHexString('#387ef5');
     },1);

 });
 }
  libraryImages = [];
  libraryVideos = [];
  media = "images";

  selectedImages() {
     let toast = this.toastCtrl.create({
     message: 'Not images in library...',
     duration: 1500,
     position: 'top'
     });
     this.storage.get('libraryImages').then((elem) => {
       if (elem == undefined || elem == null) {
         // loader.dismiss()
         toast.present();
       } else if (elem.length == 0) {
         // loader.dismiss()
         toast.present();
       }
     });
  }
  selectedVideos() {
     let toast = this.toastCtrl.create({
     message: 'Not video in library...',
     duration: 1500,
     position: 'top'
     });
     this.storage.get('libraryVideos').then((elem) => {
        console.log(elem)
       if (elem == undefined || elem == null) {
         // loader.dismiss()
         toast.present();
       } else if (elem.length == 0) {
         // loader.dismiss()
         toast.present();
       }
     });
  }

  ngOnInit() {
     let loader = this.loadingCtrl.create({
      content: "Please wait..."
     });
     let toast = this.toastCtrl.create({
      message: 'Not images in library...',
      duration: 1500,
      position: 'top'
     });

   //  let alert = this.alertCtrl.create({
   //    title: 'Oh no!',
   //    subTitle: 'Not images in library...',
   //    buttons: [{
   //      text: 'Back',
   //      handler: data => {
   //        this.navCtrl.pop();
   //      }
   //    }]
   //  });



    loader.present();
    this.storage.get('libraryImages').then((elem) => {
      this.libraryImages = [];
      if (elem == undefined || elem == null) {
        loader.dismiss()
      //   alert.present();
      toast.present();
      } else if (elem.length == 0) {
        loader.dismiss()
      //   alert.present();
      toast.present();
      } else {
        for (let i = 0; i < elem.length; i++) {
          let API_KEY = '2683000-931909b1d6f29b69f89649b0a';
          let link = 'https://pixabay.com/api/?key=' + API_KEY + '&id=' + elem[i];
          this.http.get(link)
            .subscribe(data => {
              let dataParse = data.json();
              this.libraryImages.push(dataParse.hits[0]);
            }, error => {
              console.log(error)
            });
        }
        loader.dismiss()
        console.log(this.libraryImages)
      }


    });

    this.storage.get('libraryVideos').then((elem) => {
      this.libraryVideos = [];
      if (elem == undefined || elem == null) {
        loader.dismiss()
      //   alert.present();
      // toast.present();
      } else if (elem.length == 0) {
        loader.dismiss()
      //   alert.present();
      // toast.present();
      } else {
        for (let i = 0; i < elem.length; i++) {
         this.libraryVideos.push(elem[i]);
        }
        loader.dismiss()
        console.log(this.libraryVideos)
      }


   });
  }

  openPhoto(item) {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Remove from library',
          role: 'destructive',
          handler: () => {
            this.storage.get('libraryImages').then((elem) => {
              for (let i = 0; i < elem.length; i++) {
                if (elem[i] === item.id) {
                  elem.splice(i, 1);
                  this.storage.set('libraryImages', elem).then(() => {
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

  openVideo(item) {
    console.log(item)
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
         {
           text: 'Play',
           role: 'destructive',
           handler: () => {
             this.storage.set('videoContainer', item).then(() => {
                let contactModal = this.modalCtrl.create(VideoContainerPage, { userId: 1 });
                   contactModal.present();
             });

           }
         },
         {
           text: 'Remove from library',
           role: 'destructive',
           handler: () => {
             this.storage.get('libraryVideos').then((elem) => {
               for (let i = 0; i < elem.length; i++) {
                 if (elem[i] === item) {
                   elem.splice(i, 1);
                   this.storage.set('libraryVideos', elem).then(() => {
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
           //   this.storage.clear();
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
