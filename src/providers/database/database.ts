import { Injectable } from '@angular/core';
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";
import * as moment from "moment/moment";

/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {

  private db: SQLiteObject;
  private isOpen: boolean;
  constructor(public sqlDB: SQLite) {

    if (!this.isOpen){
      this.sqlDB = new SQLite();
      this.sqlDB.create({name: "notificationList", location: "default"})
          .then((db: SQLiteObject) =>{
            this.db = db;
            db.executeSql("CREATE TABLE IF NOT EXISTS notifications (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, subtitle TEXT, body TEXT, url TEXT, image_url TEXT, date TEXT)", []);
            this.isOpen = true;
          })
          .catch((error) =>{
             console.log(error);
          });
    }
    console.log('Hello DatabaseProvider Provider');
  }

  addNotification(title:string, subtitle:string, body:string, url:string, image_url:string){
    let d1 = new Date().toISOString();
    const date = moment(d1).format("DD-MM-YYYY hh:mm a");
    return new Promise((resolve, reject) => {
      let sql = "INSERT INTO notifications (title, subtitle, body, url, image_url, date) VALUES (?,?,?,?,?,?)";
      this.db.executeSql(sql, [title,subtitle, body, url, image_url, date])
          .then((data) => {
             resolve(data);
          },(error)=>{
            reject(error);
      });
    });
  }

  listNotifications(){
    return new Promise ((resolve , reject) => {
      this.db.executeSql("SELECT * FROM notifications ORDER BY id DESC", []).then((data) => {
        let arrayNotifications = [];
        if(data.rows.length > 0){
          for (var i=0; i < data.rows.length; i++){
            arrayNotifications.push({
              title: data.rows.item(i).title,
              body: data.rows.item(i).body,
              date: data.rows.item(i).date
            });
          }
        }
        resolve(arrayNotifications);
      }, (error) => {
        reject(error);
      });
    });
  }

  openNotification(title:string){
    return new Promise((resolve, reject) =>{
      this.db.executeSql("SELECT * FROM notifications WHERE title=?",[title]).then((data) =>{
        let notification = [];
        if(data.rows.length > 0){
          for (var i=0; i < data.rows.length; i++){
            notification.push({
              title:data.rows.item(i).title,
              subtitle:data.rows.item(i).subtitle,
              body:data.rows.item(i).body,
              url:data.rows.item(i).url,
              image_url:data.rows.item(i).image_url,
              date:data.rows.item(i).date
            });
          }
        }
        resolve(notification);

      }, (error) =>{
        reject(error);
      });
    });
  }

  deleteNotification(id:number){
    return new Promise((resolve, reject) =>{
      this.db.executeSql("DELETE * FROM notifications WHERE id=?",[id]).then((data) =>{
       resolve(data);
      }, (error) =>{
        reject(error);
      });
    });
  }
}
