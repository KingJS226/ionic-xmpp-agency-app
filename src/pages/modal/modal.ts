import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { Storage } from '@ionic/storage';
import { RestProvider } from '../../providers/rest/rest';

/**
 * Generated class for the ModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {

	emergencyNos : any;
	emergencyCalls : any = [];
	call : any;
	phonenumber : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private callNumber: CallNumber, private storage: Storage,) {
    this.emergencyNos = this.navParams.get('emergencyNos');
    this.emergencyCalls = this.emergencyNos;
      console.log('phonenumber', this.emergencyCalls);
      let j=0;
    for (var i = 0;i<this.emergencyCalls.length;i++){
        j++;
        console.log('phonenumber', this.emergencyCalls[i]);
        if(j == this.emergencyCalls.length-1){
            this.phonenumber = this.emergencyCalls[j].telefono;
            console.log('phonenumber', this.phonenumber);
        }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalPage');
  }

  select(data){    
  	this.viewCtrl.dismiss(data);
  }

  closeModal(){
    this.viewCtrl.dismiss();
  }

  emerCall(callno){
  	this.callNumber.callNumber(callno, true)
    .then(() => console.log('Launched dialer!'))
    .catch(() => console.log('Error launching dialer'));
  }

}
