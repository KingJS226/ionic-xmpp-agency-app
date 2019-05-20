import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RutValidator } from '../../validators/rut';
import { Loader } from "../../providers/loader/loader";
import { RestProvider } from '../../providers/rest/rest';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the ResetpasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-resetpassword',
  templateUrl: 'resetpassword.html',
})
export class ResetpasswordPage {

	headerdisplay : any;
	public resetForm:FormGroup;
	error : any;
  rut : any;
  appid : any;
  email : any;
  idempresa : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public plt: Platform, private formBuilder: FormBuilder, 
    private loader: Loader, public toastCtrl: ToastController, public restProvider: RestProvider, private storage: Storage) {

    this.storage.get("isPassportLogin").then((resulst) => {
      console.log("results passport login status", resulst);
      if(resulst){
        this.storage.get("rut").then((getRut) => {
          console.log("getRut", getRut);
          this.rut = getRut;
        });
        this.storage.get("appid").then((getappid) => {
          console.log("getappid", getappid);
          this.appid = getappid;
        });
        this.storage.get("empresaId").then((getidempresa) => {
          console.log("getidempresa", getidempresa);
          this.idempresa = getidempresa;
        });
      }
    });

  	this.resetForm = formBuilder.group({	
	      rut: ['', Validators.compose([Validators.required, RutValidator.isValid])]
	  })

  	if (this.plt.is('ios')) {
      // This will only print when on iOS
      console.log('I am an iOS device!');
      this.headerdisplay = true;
    } else if (this.plt.is('android')) {
    	this.headerdisplay = false;
      	console.log('I am an android device!');

    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetpasswordPage');
  }

  onChange(){
    if(this.resetForm.value.rut.length > -1){
      this.error = '';
    }
  }

  reset(){
  		this.error = ''
  		this.loader.show('Please Wait'); 
  		let rut = this.resetForm.value.rut;
      // console.log("reset rut", rut);
      // console.log("this.rut", this.rut);
      // console.log("this.appid", this.appid);
      this.restProvider.getRecoverClave(rut, this.appid, this.idempresa)
      .then(data => {
        this.email = data['email'];
        // console.log("data", data);
        // console.log("this.rut", this.rut);
        if(this.email){
          this.loader.hide();        
              let toastSuccess = this.toastCtrl.create({
              message: 'Password sent, please check your mail!',
              duration: 6000,
              position: 'top',
              showCloseButton:true,
              closeButtonText:'X',
              cssClass: "toast-success",
          });
          toastSuccess.present();
          this.navCtrl.push("PassportloginPage");
        } 

        if(data['error']){
          this.error = data['error'];
        } else {
          this.error = '';
        }
      }).catch(error => {
        console.log("rut error", error);
        this.loader.hide();
        this.error = error.error['error'];
      });
  		
  	}

}
