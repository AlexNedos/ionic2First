import { Component, ViewChild } from '@angular/core';
import * as $ from 'jquery';
import { Nav, Content, NavController, ActionSheetController, ToastController, App, ViewController, Platform, ModalController } from 'ionic-angular';
import { Http } from '@angular/http';
import { LibraryPage } from '../library/library';
import { VideoContainerPage } from '../videoContainer/videoContainer';
import { Storage } from '@ionic/storage';
import { StatusBar } from 'ionic-native';


@Component({
  selector: 'page-video',
  templateUrl: 'video.html'
})
export class VideoPage {
  @ViewChild(Nav) nav: Nav;
  @ViewChild(Content) content: Content;

  constructor(
     public navCtrl: NavController,
    public http: Http,
    public actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public viewCtrl: ViewController,
    public appCtrl: App,
    public storage: Storage,
    public platform: Platform
  ) {
     platform.ready().then(() => {
     setTimeout(() => {
      StatusBar.overlaysWebView(true);
      StatusBar.backgroundColorByHexString('#f53d3d');
     },1);
  });
 }
  items = [];
  library = [];
  page = 1;
  categoryType = '';

  openLibrary() {
    this.appCtrl.getRootNav().push(LibraryPage);
  }

  onPageScroll(event) {

     if ($(".scroll-content ion-list").height() != 0) {
        $(".headerHome").css({
          top: '-187px'
        });
        $(".contentHome .scroll-content").css({
          marginTop: '0px'
        });

        $(".platform-ios ion-fab").css({
          top: '-180px',
          right: '10px'
        });
        $(".platform-android ion-fab").css({
          top: '-170px',
          right: '10px'
        });
     }

    }


  viewMenu() {
    $(".headerHome").css({
      top: '0px'
    });
    $(".contentHome .scroll-content").css({
      marginTop: '179px'
    });

    $("ion-fab").css({
      top: '-1000px',
      right: '10px'
    });
  }

  ngAfterViewInit() {
    this.content.addScrollListener(this.onPageScroll);
  }


  logForm(data, category) {
    if (data === undefined) {
      this.presentToast(data)
    } else if (data === '') {
      this.presentToast(undefined)
    } else {
      this.content.scrollToTop(300);
      this.categoryUndefined(category);
      // console.log(this.content.getContentDimensions().scrollBottom)

      this.page = 1;
      let API_KEY = '2683000-931909b1d6f29b69f89649b0a';
      let link = 'https://pixabay.com/api/videos/?key=' + API_KEY + '&q=' + encodeURIComponent(data) + '&pretty=true&page=1' + this.categoryType;
      // let link = 'https://pixabay.com/api/videos/?key=' + API_KEY + '&q=yellow+flowers'
      this.http.get(link)
        .subscribe(data => {
          let dataParse = data.json();
          console.log(dataParse);
          this.items = [];
          if (dataParse.total === 0) {
            this.presentToast(null)
          } else {
            this.items = [];
            for (var i = 0; i < dataParse.hits.length; i++) {
              this.items.push(dataParse.hits[i].videos.small.url);
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
        let link = 'https://pixabay.com/api/videos/?key=' + API_KEY + '&q=' + encodeURIComponent(data) + '&page=' + this.page + this.categoryType;

        this.http.get(link)
          .subscribe(data => {
            let dataParse = data.json();
            for (var i = 0; i < dataParse.hits.length; i++) {
              this.items.push(dataParse.hits[i].videos.medium.url);
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
      duration: 1500,
      position: 'top'
    });
    toast.present();
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
          text: 'Add to library',
          role: 'destructive',
          handler: () => {
           this.storage.get('library').then((elem) => {
              if (elem === null) {
                this.library.push(item.id);
                this.storage.set('library', this.library).then(() => {
                });
              } else {
                let checked = false;
                for (let i = 0; i < elem.length; i++) {
                  if (elem[i] === item.id) {
                    checked = true;
                  }
                }
                if (checked === false) {
                  elem.push(item.id);
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
