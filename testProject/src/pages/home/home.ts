import { Component, ViewChild } from '@angular/core';
// import * as $ from 'jquery';
import { Nav, Content, NavController, ToastController, App, ViewController, Platform } from 'ionic-angular';
// import { Http } from '@angular/http';
import { LibraryPage } from '../library/library';
import { ImagePage } from '../image/image';
import { VideoPage } from '../video/video';
import { StatusBar } from 'ionic-native';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Nav) nav: Nav;
  @ViewChild(Content) content: Content;

  constructor(
    public navCtrl: NavController,
   //  public http: Http,
   //  public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public viewCtrl: ViewController,
    public appCtrl: App,
    public platform: Platform
  ) {
       platform.ready().then(() => {
       setTimeout(() => {
          StatusBar.overlaysWebView(true);
          StatusBar.styleLightContent();
          StatusBar.backgroundColorByHexString('#252525');
       },1);
     });
 }

  openLibrary() {
    this.appCtrl.getRootNav().push(LibraryPage);
  }
  openImage() {
    this.appCtrl.getRootNav().push(ImagePage);
  }
  openVideo() {
    this.appCtrl.getRootNav().push(VideoPage);
  }



}
