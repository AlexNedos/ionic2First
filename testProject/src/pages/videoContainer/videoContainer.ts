import { Component } from '@angular/core';

import { Platform, ViewController } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { Storage } from '@ionic/storage';



@Component({
  selector: 'page-videoContainer',
  templateUrl: 'videoContainer.html'
})
export class VideoContainerPage {


  constructor(
public platform: Platform,
    public storage: Storage,
    public viewCtrl: ViewController

  ) {
     platform.ready().then(() => {
     setTimeout(() => {
     StatusBar.overlaysWebView(true);
     StatusBar.backgroundColorByHexString('#387ef5');
     },1);
 });
 }
 items = [];
 ngAfterViewInit() {
    this.storage.get('videoContainer').then((elem) => {
      console.log(elem)
      this.items = [];
      this.items.push(elem)
   });
 }

 closeVideo() {
    let data = { 'userId': '1' };
       this.viewCtrl.dismiss(data);
}



}
