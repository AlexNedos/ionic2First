import { Component, ViewChild } from '@angular/core';
// import * as $ from 'jquery';
import { Nav, Content, NavController, ToastController, App, ViewController, Platform } from 'ionic-angular';
// import { Http } from '@angular/http';
import { LibraryPage } from '../library/library';
// import { StatusBar } from 'ionic-native';


@Component({
  selector: 'page-video',
  templateUrl: 'video.html'
})
export class VideoPage {
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
  ) { }

  openLibrary() {
    this.appCtrl.getRootNav().push(LibraryPage);
  }



}
