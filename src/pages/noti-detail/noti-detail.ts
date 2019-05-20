import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {MenuPage} from '../menu/menu';
import {DatabaseProvider} from "../../providers/database/database";

/**
 * Generated class for the NotiDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-noti-detail',
  templateUrl: 'noti-detail.html',
})
export class NotiDetailPage {
  title: any = "";
  content: any;
  body:any = "";
  subtitle:any = "";
  url:any = "";
  image_url:any;
  time:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public db: DatabaseProvider) {
    this.title = this.navParams.get('message');
    this.db.openNotification(this.title).then((data) => {
      this.content = data;
      if (this.content[0].title){
        this.title = this.content[0].title;
      }
      if(this.content[0].body){
        this.body = this.content[0].body;
      }if(this.content[0].subtitle){
        this.subtitle = this.content[0].subtitle;
      }if(this.content[0].url){
        this.url = this.content[0].url;
      }if(this.content[0].image_url){
        this.image_url = decodeURI(this.content[0].image_url);
      }
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotiDetailPage');
  }

  close(){
      this.navCtrl.push('MenuPage');
  }

}
