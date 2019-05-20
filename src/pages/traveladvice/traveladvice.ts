import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { Storage } from '@ionic/storage';
import { MenuPage } from '../../pages/menu/menu';
import { Base64 } from '@ionic-native/base64';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the TraveladvicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-traveladvice',
  templateUrl: 'traveladvice.html',
})
export class TraveladvicePage {

  // advices: any;
  adviceArray : any = [];
  getdata : any;
  corpocustoTravel : boolean;
  travelAgencyTravel : boolean;
  getcompanyLogo : any;
  travelTips : any;

  texto: any;
  imagen: any;
  // img: any;
  // base64Image: any;
  adviceArrays64: any =[];
  // onlineGrid: any;
  // offlineGrid: any;
  // adviceArrays64Image: any=[];
  // onlineTexto: boolean;
  // offlineTexto: boolean;
  // imageArray: any = [];
  // allTexto: any;
  // adviceArrayTexto: any = [];
  // adviceArrays64Texto: any =[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public restProvider: RestProvider, public storage: Storage, private base64: Base64) {
    this.storage.get('rutdata').then((getdata) => {
      // console.log('getdata ' +getdata);
      this.getdata = getdata;
    });
    this.storage.get('companyLogo').then((getcompanyLogo) => {
      // console.log('getcompanyLogo',getcompanyLogo);
      this.getcompanyLogo = getcompanyLogo;
      // console.log('this.getcompanyLogo',this.getcompanyLogo);
    });
    this.getTravelAdviceData();

    this.storage.get("isLogin").then((resulst) => {
      // console.log("results travel advice status", resulst);
      if(resulst){
        
        this.corpocustoTravel = true;
        this.travelAgencyTravel = false;
      } else {
        this.corpocustoTravel = false;
        this.travelAgencyTravel = true;
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TraveladvicePage');
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
            // callback(dataURL);
            canvas = null;
            resolve(dataURL);
        };
        img.src = url;
    });
  }


  getTravelAdviceData() {
    
    if(this.restProvider.getNetworkType() == 'none') {
      // this.onlineGrid = false;
      // this.offlineGrid = true;

      this.storage.get('companyLogoOffline').then((data) => {
        // Do something with latitude value
        // console.log("offline data", data);
        this.getcompanyLogo = data;
      });

      this.storage.get('travelTips64Image').then((data) => {
        // Do something with latitude value
        // console.log("offline data", data);
        this.adviceArray = data;
        // console.log("offline this.adviceArray", this.adviceArray);
      });

    } else {

      // this.offlineGrid = false;
      // this.onlineGrid = true;

      this.restProvider.getTravelAdvice()
      .then(data => {
        let serviceData : any =  data['consejosviaje'];
        
        this.adviceArray = serviceData;
        let base64Image;
        for (let i in serviceData) {
          this.imagen = serviceData[i].imagen;

          this.convertToDataURLviaCanvas(this.imagen, "image/jpeg").then(base64 => {
            base64Image = base64;
            this.texto = serviceData[i].texto;
            // this.adviceArrays64.push({'texto': this.texto, 'imagen': base64Image});
            this.adviceArrays64.push({'texto': this.texto, 'imagen': base64Image});
            this.storage.set("travelTips64Image", this.adviceArrays64);
            // console.log("this.adviceArrays64", this.adviceArrays64);
            // this.adviceArray = this.adviceArrays64;
          });
        }
      });
    }
  }

  goback(){
      this.navCtrl.push(MenuPage);
  }

}
