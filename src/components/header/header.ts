import { Component , Input} from '@angular/core';
import { Storage } from "@ionic/storage";
import { App, NavController} from "ionic-angular";
import { RestProvider } from '../../providers/rest/rest';
import { Loader } from "../../providers/loader/loader";
import { AlertController } from 'ionic-angular';
/**
 * Generated class for the HeaderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'header',
  templateUrl: 'header.html'
})
export class HeaderComponent {
	@Input() title: any;
	text: string;

  corpocustoHeader : boolean;
  travelAgencyHeader : boolean;
  // appID : any;
  empresaID : any;
  companyLogo : any;
  error : any = '';
  appID: any = '12345678';

  imagen: any;
  img: any;
  companyLogobase64: any;
	constructor(public navCtrl: NavController, public app: App, public restProvider: RestProvider,
    private storage: Storage, private loader: Loader, private alertCtrl: AlertController) {
  	console.log('Hello HeaderComponent Component');
  	this.text = 'Hello World';
    this.storage.get("empresaId").then((getempresaID) => {
      this.empresaID = getempresaID;
    });
    this.getImageIconCompany();
  }
  convertToDataURLviaCanvas(url, outputFormat) {
    return new Promise((resolve, reject) => 
    {
        let img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
            let canvas = <HTMLCanvasElement>document.createElement('CANVAS'),
                ctx = canvas.getContext('2d'),
                dataURL;
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img, 0, 0);
            dataURL = canvas.toDataURL(outputFormat);
            canvas = null;
            resolve(dataURL);
        };
        img.src = url;
    });
  }

  getImageIconCompany() {
    this.storage.get("isLogin").then((resulst) => {
      if(resulst){
        if(this.restProvider.getNetworkType() == 'none') {
          this.storage.get('companyLogo64').then((data) => {
              this.companyLogo = data;
              this.storage.set('companyLogoOffline', this.companyLogo);
              this.corpocustoHeader = true;
              this.travelAgencyHeader = false;
          });
          
        } else {
          this.restProvider.getCompanyIconImage(this.empresaID,this.appID)
          .then(data => {
              this.companyLogo = data['urlarchivo'];
              this.convertToDataURLviaCanvas(this.companyLogo, "image/jpeg").then(base64 => {
                  this.companyLogobase64 = base64;
                  this.storage.set('companyLogo64', this.companyLogobase64);
                });
              this.storage.set('companyLogo', this.companyLogo);
              this.corpocustoHeader = true;
              this.travelAgencyHeader = false;
          }).catch(error => {
            this.loader.hide();
            let alert = this.alertCtrl.create({
              title: 'error',
              subTitle: error.error['error'],
              buttons: ['Dismiss']
            });
            alert.present();
          });
        }
      } else {
        this.corpocustoHeader = false;
        this.travelAgencyHeader = true;
      }
    });
  }

 	logout(){
      window.localStorage.removeItem('usuario');
      window.localStorage.removeItem('password');
      this.storage.clear();
      this.app.getRootNav().push("PassportloginPage");
 	}

}
