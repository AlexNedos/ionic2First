import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LibraryPage } from '../pages/library/library';
import { ImagePage } from '../pages/image/image';
import { VideoPage } from '../pages/video/video';
import { Storage } from '@ionic/storage';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ImagePage,
    VideoPage,
    LibraryPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ImagePage,
    VideoPage,
    LibraryPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, Storage]
})
export class AppModule {}
