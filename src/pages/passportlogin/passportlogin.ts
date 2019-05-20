import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Keyboard } from '@ionic-native/keyboard';
import { RestProvider } from '../../providers/rest/rest';
import { RutValidator } from '../../validators/rut';
import { Storage } from '@ionic/storage';
import { Loader } from "../../providers/loader/loader";

/**
 * Generated class for the PassportloginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-passportlogin',
  templateUrl: 'passportlogin.html',
})
export class PassportloginPage {
	headerdisplay : any;
	public passportloginForm:FormGroup;  
  error : any = '';
  rut : any;
  VIP: boolean = false;
  cargo: any;
  empresaID : any;
  token : any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public plt: Platform, private loader: Loader,
              private formBuilder: FormBuilder, public keyboard: Keyboard, public restProvider: RestProvider,
              public storage: Storage) {
  	this.passportloginForm = formBuilder.group({
      usuario: ['', Validators.compose([Validators.required, RutValidator.isValid])]
    });

  	if (this.plt.is('ios')) {
      console.log('I am an iOS device!');
      this.headerdisplay = true;
    } else if (this.plt.is('android')) {
    	this.headerdisplay = false;
      	console.log('I am an android device!');
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PassportloginPage');
  }
  onChange(){
      if (this.rut){
          if (this.rut.length>0){
              if (this.rut.split("-")[1] || this.rut.split("-")[1] == ""){
                  this.rut = this.rut.split("-")[0]+this.rut.split("-")[1];
                  console.log('rut',this.rut);
              }
              console.log(this.rut.slice(0, this.rut.length));
              this.rut = this.rut.slice(0, this.rut.length)+"-";

          }
      }
  }
  passportlogin(){
    this.error = '';
    this.loader.show('Please Wait');
    let rutData : any = this.passportloginForm.value.usuario;
    if(this.passportloginForm.value.usuario == '' || this.passportloginForm.value.usuario.length == 0){
      this.loader.hide();
      this.navCtrl.push("MenuPage");
    } else{
      window.localStorage.setItem('usuario', this.passportloginForm.value.usuario);
      this.restProvider.getRut(rutData)
      .then(data => {
        console.log("new api authentication data ", data);
        this.VIP = data['VIP'];
        this.storage.set('vip', this.VIP);
        this.cargo = data['cargo'];
        this.storage.set('cargo', this.cargo);
        this.empresaID = data['idempresa'];
        this.storage.set('empresaId', this.empresaID);
        this.storage.set('rut', data['RUT']);
        if(data['error']){
          this.loader.hide();
          this.error = data['error'];
        } else {
          this.loader.hide();
          this.storage.set('isPassportLogin', true);
          this.navCtrl.push("PasswordPage", {rut: data['RUT']});
        }
      }).catch(error => {
        console.log("rut error", error);
        this.loader.hide();
        
        if(error.error['error'] == "RUT no existe") {
            this.error = "Rut Invalido";
        } else {
          this.error = error.error['error'];
        }

      });
    }
  }

}
