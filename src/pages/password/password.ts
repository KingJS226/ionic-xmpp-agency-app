import { Component, ViewChild } from '@angular/core';
import { Nav, IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Keyboard } from '@ionic-native/keyboard';
import { RestProvider } from '../../providers/rest/rest';
import { Storage } from '@ionic/storage';
import { Loader } from "../../providers/loader/loader";
import { FCM } from '@ionic-native/fcm';
import {XMPPService} from "../../providers/xmpp-service/xmpp-service";
import {MenuPage} from "../menu/menu";


/**
 * Generated class for the PasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-password',
  templateUrl: 'password.html',
})
export class PasswordPage {

  @ViewChild(Nav) nav: Nav;

  headerdisplay : any;
  public passwordloginForm:FormGroup;
  error : any;
  rut : any;
  appID : any;
  empresaID : any;
  JID : any;
  senderJID : any;
  userID : any;
  userEmail : any;
  empresa : any;
  private jid : string = "";
  private host : string = "";
  private password : string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public plt: Platform, private loader: Loader,public xmppService: XMPPService,
               private formBuilder: FormBuilder, public keyboard: Keyboard, public restProvider: RestProvider, public storage: Storage, private fcm: FCM) {

    this.rut = this.navParams.get('rut');
  	this.passwordloginForm = formBuilder.group({
      password: ['', Validators.compose([Validators.required, Validators.required])]
    });

    this.plt.ready().then(() =>{
      if (this.plt.is('ios')) {
        // This will only print when on iOS
        console.log('I am an iOS device!');
        this.headerdisplay = true;
        this.fcm.getToken().then(token => {
          this.storage.set('device_token', token);
        }).catch(err=> console.log(err));
      } else if (this.plt.is('android')) {
        this.headerdisplay = false;
        this.fcm.getToken().then(token => {
          this.storage.set('device_token', token);
        }).catch(err=> console.log(err));
      }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PasswordPage');
  }

  onChange(){
    if(this.passwordloginForm.value.password.length > -1){
      this.error = '';
    }
  }

  passwordlogin(){
    this.error = '';
    this.loader.show('Please Wait');
    let clave : any = this.passwordloginForm.value.password;
    
    if(this.passwordloginForm.value.password == ''){
      this.error = "please enter your Password";
    } else{
      window.localStorage.setItem('password', this.passwordloginForm.value.password);
      this.restProvider.getClaveData(this.rut, clave)
      .then(data => {
        this.appID = "12345678";
        this.storage.set('appId', this.appID);
        this.empresaID = data['idempresa'];
        this.storage.set('empresaId', this.empresaID);
        this.storage.set('password', clave);
        if(data['error']){
          this.error = data['error'];
          this.loader.hide();       
        } else {
          this.loader.hide();
          this.empresa = data['idempresamadre'];
          this.storage.set('empresa', this.empresa);
          this.storage.set('isLogin', true);
          this.rut = data['RUT'];
          this.storage.set('RUT', this.rut);
          this.host = data['servidor'];
          this.storage.set('userName', this.host);
          this.jid = data['JID'];
          this.userID = data['idUsuario'];
          this.storage.set('userid', this.userID);
          this.userEmail = data['email'];
          this.storage.set('useremail', this.userEmail);
          this.storage.set('senderJID', this.jid);
          window.localStorage.setItem('senderjid', this.jid);
          this.storage.get('device_token').then(getToken =>{
            this.restProvider.sendToken(this.rut, clave,getToken);
          })
           this.navCtrl.push(MenuPage);
        }
      }).catch(error => {
        this.loader.hide();
        this.error = error.error['error'];
      });
    }
  }
  resetpassword(){
    this.navCtrl.push("ResetpasswordPage");
  }
}
