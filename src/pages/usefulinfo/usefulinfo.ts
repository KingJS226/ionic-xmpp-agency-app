import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { RestProvider } from '../../providers/rest/rest';
import { Loader } from "../../providers/loader/loader";
import { MenuPage } from '../../pages/menu/menu';
import { SelectSearchableComponent } from 'ionic-select-searchable';
/**
 * Generated class for the UsefulinfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
class Port {
    public nombre: string;
    public datosutiles: object;
}


@IonicPage()
@Component({
  selector: 'page-usefulinfo',
  templateUrl: 'usefulinfo.html',
})
export class UsefulinfoPage {

  countries: string[];
  errorMessage: string;
  appID : any;

  corpocustoInfo : boolean;
  travelAgencyInfo : boolean;
  country: any;
  error : any = '';
  infoarray : any =[];
  informations : any = [];
  userInfo : any = [];
  directionInfo : any;
  getcompanyLogo : any;
  moneda : any;
  capital : any;
  idioma : any;
  nombre : any;
  direccion : any;
  email : any;
  telephone : any = [];
  selectedcountry : boolean = false;
  datoutils: any;
  matchPais: boolean = false;
  countrie: any;

  ports: Port[];
  port: Port;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, 
    public restProvider: RestProvider, private loader: Loader) {

    this.storage.get('companyLogo').then((getcompanyLogo) => {
      this.getcompanyLogo = getcompanyLogo;
    });
    this.getDatoUtils();
  }

  getDatoUtils() {
    this.storage.get("isLogin").then((resulst) => {
      if(resulst){
        this.corpocustoInfo = true;
        this.travelAgencyInfo = false;
        this.storage.get('appId').then((appID) => {
          this.appID = appID;
          if(this.restProvider.getNetworkType() == 'none') {
            this.storage.get('companyLogoOffline').then((data) => {
              this.getcompanyLogo = data;
            });
            
            this.storage.get('datoUtils').then((data) => {
                this.informations = data;
                this.ports = this.informations;
            });

          } else {
            this.restProvider.getuserInfoWithCountry(this.appID)
              .then(data => {
                this.informations = data;
                this.ports = this.informations;
                this.storage.set("datoUtils", this.ports);
            }).catch(error => {
              console.log("user info error", error);
              this.loader.hide();
            });  
          }
        });
      } else {
        this.corpocustoInfo = false;
        this.travelAgencyInfo = true;
      }
    });
  }

  portChange(event: { component: SelectSearchableComponent, value: any }) {

        this.error = '';
        this.countrie = event.value.nombre;
        for (var i = 0; i < this.informations.length; i++) {
          if(this.ports[i].nombre === event.value.nombre) {
              this.selectedcountry = true;
              this.datoutils = this.ports[i].datosutiles;
              this.moneda = this.datoutils.moneda;
              // console.log("this.moneda", this.moneda);
              this.capital = this.datoutils.capital;
              // console.log("this.capital", this.capital);
              this.idioma = this.datoutils.idioma;
              // console.log("this.idioma", this.idioma);
              this.nombre = this.datoutils.consulados.nombre;
              // console.log("this.nombre", this.nombre);
              this.direccion = this.datoutils.consulados.direccion;
              // console.log("this.direccion", this.direccion);
              this.email = this.datoutils.consulados.email;
              // console.log("this.email", this.email);
              this.telephone = this.datoutils.consulados.telefonos;
              // console.log("this.telephone", this.telephone);
            
          } else {
            console.log("else");
          }
        }
    }

  
  ionViewDidLoad() {
    console.log('ionViewDidLoad UsefulinfoPage');
    this.getDatoUtils();
  }

  goback(){
      this.navCtrl.push(MenuPage);
  }

}
