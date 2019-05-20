import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {DatabaseProvider} from "../../providers/database/database";
import {NotiDetailPage} from "../noti-detail/noti-detail";

/**
 * Generated class for the NotiListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-noti-list',
  templateUrl: 'noti-list.html',
})
export class NotiListPage {
  listNoti:any = [];
  pages_notification: Array<{title: any, body: any, date: any, icon: any}> =[];
  constructor(public navCtrl: NavController, public navParams: NavParams,public db: DatabaseProvider) {
    this.loadPages();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotiListPage');
  }
  loadPages(){
    this.listNoti=[];
    this.db.listNotifications().then((data1) =>{

      for (var i=0; i<Object.keys(data1).length; i++){
        this.listNoti.push({icon: 'ios-arrow-forward', title:data1[i].title, body:data1[i].body, date:data1[i].date});
      }
      this.pages_notification = this.listNoti;
    });
  }

  openDetailPage(page){
    if (page.title){
      this.navCtrl.push(NotiDetailPage,{message:page.title});
    }
  }
}
