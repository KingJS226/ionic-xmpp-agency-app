import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Keyboard } from '@ionic-native/keyboard';
import { IonicStorageModule } from '@ionic/storage';
import { FileTransfer} from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MenuPage } from '../pages/menu/menu';
import { PassportloginPage } from '../pages/passportlogin/passportlogin';
import { PassportloginPageModule } from '../pages/passportlogin/passportlogin.module';
import { HeaderComponent } from '../components/header/header';
import { HeaderComponentModule } from '../components/header/header.module';
import { FooterComponentModule } from '../components/footer/footer.module';
import { EmojiPickerComponentModule } from '../components/emoji-picker/emoji-picker.module';
import { CallNumber } from '@ionic-native/call-number';
import { Loader } from '../providers/loader/loader';
import { EmojiProvider } from '../providers/emoji';
import { HttpClientModule } from "@angular/common/http";
import { RestProvider } from '../providers/rest/rest';
import { FCM } from '@ionic-native/fcm';
import { Network } from '@ionic-native/network';
import { Push } from '@ionic-native/push';
import { CacheModule } from 'ionic-cache';
import { Base64 } from '@ionic-native/base64';
import { SelectSearchableModule } from 'ionic-select-searchable';
import {ChatPage} from "../pages/chat/chat";
import { Firebase } from '@ionic-native/firebase';
import {NotiDetailPage} from "../pages/noti-detail/noti-detail";
import {FileChooser} from "@ionic-native/file-chooser";
import {AndroidPermissions} from "@ionic-native/android-permissions";
import {Diagnostic} from "@ionic-native/diagnostic";
import {BackgroundMode} from "@ionic-native/background-mode";
import { DatabaseProvider } from '../providers/database/database';
import {SQLite} from "@ionic-native/sqlite";
import {FileOpener} from "@ionic-native/file-opener";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
      ChatPage,
      NotiDetailPage,
    MenuPage
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot(MyApp, { scrollAssist: false }),
    IonicStorageModule.forRoot({
        name: '__mydb',
        driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    CacheModule.forRoot(),
    HeaderComponentModule,
    FooterComponentModule,
    PassportloginPageModule,
    EmojiPickerComponentModule,
    SelectSearchableModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ChatPage,
    PassportloginPage,
    MenuPage,
    NotiDetailPage,
    HeaderComponent,
  ],
  providers: [
    Keyboard,
    StatusBar,
    Diagnostic,
    BackgroundMode,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    EmojiProvider,
    CallNumber,
    Loader,
    RestProvider,
    FCM,
    Firebase,
    Push,
    FileTransfer,
    File,
    Camera,
    FileChooser,
    Network,
    AndroidPermissions,
    Base64,
    DatabaseProvider,
    SQLite,
    FileOpener
  ]
  
})
export class AppModule {}
