import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, NavController, App, AlertController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { Storage } from '@ionic/storage';
import { FCM } from '@ionic-native/fcm';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { RestProvider } from '../providers/rest/rest';
import { MenuPage } from '../pages/menu/menu';
import { PassportloginPage } from '../pages/passportlogin/passportlogin';
import { CacheService } from "ionic-cache";
import {XMPPService} from "../providers/xmpp-service/xmpp-service";
import { Firebase } from '@ionic-native/firebase';
import {BackgroundMode} from "@ionic-native/background-mode";
import {DatabaseProvider} from "../providers/database/database";
import {ChatPage} from "../pages/chat/chat";
import {Loader} from "../providers/loader/loader";
import {NotiListPage} from '../pages/noti-list/noti-list';
@Component({
  templateUrl: 'app.html',
  providers: [XMPPService]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  @ViewChild('myNav') navCtrl: NavController;
  rootPage:any = PassportloginPage;
  jID : any;
  clave: any;
  corpocustoContent : boolean;
  travelAgencyContent : boolean;
   Rut : any;
  error : any = '';
  appID : any;
  empresaID : any;
  companyLogo : any;
  jid: any;
  name : any;
  senderJID : any;
  password : any;
  pages: Array<{title: any, component: any, icon: any}> =[];
  constructor(public loader: Loader, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private keyboard: Keyboard, public menu: MenuController,
    public storage: Storage, public fcm: FCM, public app: App, public push: Push, public alertCtrl: AlertController,public xmppService: XMPPService,public firebase: Firebase, public restProvider: RestProvider, public events: Events, cache: CacheService, public backgroundmode: BackgroundMode, public db: DatabaseProvider) {
      this.backgroundmode.enable();
      this.pages = [
          { icon: 'ios-arrow-forward', title: 'Solicita tu viaje', component: 'ChatPage'},
          { icon: 'ios-arrow-forward', title: 'Consejos para tu viaje', component: 'TraveladvicePage'},
          { icon: 'ios-arrow-forward', title: 'Datos Utiles', component: 'UsefulinfoPage'},
          { icon: 'ios-arrow-forward', title: 'Notificaciones', component: 'NotiListPage'},
      ];
      this.platform.ready().then(() => {
         statusBar.styleDefault();
         splashScreen.hide();
      this.initializeApp(statusBar, splashScreen);
      this.restProvider.initializeNetworkEvents()
      this.events.subscribe('network:offline', () => {
        console.log('network:offline ==> ' + this.restProvider.getNetworkType())
        console.log('network was disconnected :-(');
      })
      this.events.subscribe('network:online', () => {
        console.log('network:online ==> ' + this.restProvider.getNetworkType())
      })
      this.storage.set('appid', this.appId);
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.statusBar.show();
      this.keyboard.onKeyboardShow().subscribe(() => {
          document.body.classList.add('keyboard-is-open');
      });
      this.keyboard.onKeyboardHide().subscribe(() => {
          document.body.classList.remove('keyboard-is-open');
      });
      this.fcm.onNotification().subscribe(data => {
            console.log('notification', JSON.stringify(data));

            let message = JSON.parse(JSON.stringify(data));
             this.db.addNotification(message.title, message.subtitle, message.body, message.url,message.image_url).then((data) => {
                 // alert(data);
                 this.app.getRootNav().push('NotiListPage');
        });
      });
  });
  this.xmppService.dismiss.subscribe((value) => {
          if (value == "login") {
              this.app.getRootNav().push(ChatPage);
          } else if (value == "logout") {
          }
      });
  }

  initializeApp(statusBar: StatusBar, splashScreen: SplashScreen) {
    let usuario = window.localStorage.getItem('usuario') ? window.localStorage.getItem('usuario') : '';
    let password = window.localStorage.getItem('password') ? window.localStorage.getItem('password') : '';
    let jid = window.localStorage.getItem('senderjid') ? window.localStorage.getItem('senderjid') : '';
    if(usuario && password) {
        console.log(this.storage.get('RUT'));
        console.log(usuario);
        this.nav.setRoot(MenuPage);
    }else{
      this.nav.setRoot(PassportloginPage);
    }
  }

  openPage(page) {
    this.menu.close();
    if (page.component == "ChatPage"){
        this.storage.get("senderJID").then((getsenderJID) => {
            console.log("getsenderJID", getsenderJID);
            this.senderJID = getsenderJID;
        });
        this.storage.get("empresaId").then((getempresaID) => {
            this.empresaID = getempresaID;
        });
        this.storage.get("appId").then((getappID) => {
            this.appID = getappID;
        });
        this.storage.get("password").then((pass) =>{
            this.password = pass;
        });
        this.storage.get("isPassportLogin").then((resulst) => {
            if(resulst){
                this.storage.get("RUT").then((getRut) => {
                    this.Rut = getRut;
                    console.log('rut>>>>>>>>>',this.Rut);
                    this.restProvider.getJIDtoChat(this.Rut, this.appID, this.empresaID)
                        .then(data => {
                            console.log("getJIDtoChat", data);
                            console.log("data['error']", data['error']);
                            if(data['error']){
                                //this.loader.hide();
                                let alert = this.alertCtrl.create({
                                    subTitle: data['error'],
                                    buttons: ['Dismiss']
                                });
                                alert.present();
                            } else {
                                this.jid = data['jid'];
                                this.storage.set('name', data['nombre']);
                                this.storage.set('reciverJID', this.jid);
                                console.log('>>>>>>>>>>>>>>>>',this.senderJID,this.password);
                                this.loader.show('Please Wait');
                                this.xmppService.login(this.senderJID, this.password);
                            }

                        }).catch(error => {
                        //this.loader.hide();
                        console.log("rut error", error);
                        let alert = this.alertCtrl.create({
                            subTitle: error.error.error,
                            buttons: ['Dismiss']
                        });
                        alert.present();
                    });
                });

            } else {}
        });

    }else {
        if(page.component){
            this.app.getRootNav().push(page.component);
        }
    }

  }
}

