import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { RestProvider } from '../../providers/rest/rest';
import { AlertController } from 'ionic-angular';
import { Loader } from "../../providers/loader/loader";
import {XMPPService} from "../../providers/xmpp-service/xmpp-service";
/**
 * Generated class for the MenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

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
  constructor(public navCtrl: NavController, public navParams: NavParams, private loader: Loader,
    private storage: Storage, public restProvider: RestProvider, public modalCtrl: ModalController, private alertCtrl: AlertController, public xmppService: XMPPService) {
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
        });
        this.corpocustoContent = true;
        this.travelAgencyContent = false;
      } else {
        this.corpocustoContent = false;
        this.travelAgencyContent = true;
      }
    });
  }

  ionViewDidLoad() {
  }
  chatting(){
    this.restProvider.getJIDtoChat(this.Rut, this.appID, this.empresaID)
      .then(data => {
        if(data['error']){
          //this.loader.hide();
            let alert = this.alertCtrl.create({
              subTitle: data['error'],
              buttons: ['Dismiss']
            });
            alert.present();
        } else {
          //this.loader.hide();
          this.jid = data['jid'];
          this.storage.set('name', data['nombre']);
          this.storage.set('reciverJID', this.jid);
          this.loader.show('Please Wait');
          this.xmppService.login(this.senderJID, this.password);
        }
        
      }).catch(error => {
        console.log("rut error", error);
        let alert = this.alertCtrl.create({
          subTitle: error.error.error,
          buttons: ['Dismiss']
        });
        alert.present();
    });
  }

  traveladvice(){
    this.loader.show('Please Wait');
    this.loader.hide();
    this.navCtrl.push("TraveladvicePage");
  }
  usefulinfo(){
    this.loader.show('Please Wait');
    this.loader.hide();
    this.navCtrl.push("UsefulinfoPage");
  }
  phone(){
    this.loader.show('Please Wait');
    if(this.restProvider.getNetworkType() == 'none') {
      this.loader.hide();
      this.storage.get("offlineTelephono").then((resulst) => {
        let modal = this.modalCtrl.create('ModalPage', {'emergencyNos':resulst});
          modal.present();
      });
    } else {
      this.restProvider.getEmergencyCall(this.Rut)
      .then(data => {
        if(data['error']){
          this.error = data['error'];
          this.loader.hide();
        } else {
          this.error = '';
          this.loader.hide();
          this.storage.set('offlineTelephono', data['telefonosemergencia']);
          let modal = this.modalCtrl.create('ModalPage', {'emergencyNos':data['telefonosemergencia']});
          modal.present();
        }
      }).catch(error => {
        this.loader.hide();
        this.error = error.error['error'];
      });
    }
      
  }

}
