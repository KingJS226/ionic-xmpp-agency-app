import { Component,ElementRef, ViewChild } from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController, Platform, ToastController} from 'ionic-angular';
import { Events, Content } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { RestProvider, UserInfo } from '../../providers/rest/rest';
import { Loader } from "../../providers/loader/loader";
import { MenuPage } from '../../pages/menu/menu';
import {Strophe} from "strophe.js";
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import {XMPPService} from "../../providers/xmpp-service/xmpp-service";
import { File } from '@ionic-native/file';
import {AndroidPermissions} from "@ionic-native/android-permissions";
import {Diagnostic} from "@ionic-native/diagnostic";
import {FileOpener} from "@ionic-native/file-opener";
declare function enviaArchivo(debug,cancelar,idUpload);
declare let cordova: any;

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})

export class ChatPage {
  @ViewChild(Content) content: Content;
  @ViewChild('chat_input') messageInput: ElementRef;
  @ViewChild('ptag') ptag: ElementRef;
  parser = new DOMParser;
  msgArray: any[] = [];
  storageDirectory: string = '';
  isFile:any;
  dom: any;
  tag2:any;
  interval:any;
  user: UserInfo;
  toUser: UserInfo;
  editorMsg = '';
  getdata : any;
  reciverJID : any;
  name : any;
 start = true;
 fileState:any;
  senderJID : any;
  userID : any;
  userEmail : any;
  userName : any;
  username : any;
  vip:any;
  cargo:any;
  firstMsg:any;
  showEmojiPicker = false;
  appID: any = '12345678';
  empresaID : any;
  empresa : any;
  companyLogo : any;
  corpocustoHeader : boolean;
  travelAgencyHeader : boolean;
  private messages : Array<Object> = [];
  private saveMessages : Array<Object> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,private toastCtrl: ToastController,
              private events: Events, public storage: Storage,
              public restProvider: RestProvider,public xmppService: XMPPService,
              private loader: Loader, private alertCtrl: AlertController,private transfer: FileTransfer,
              private file: File, private platform: Platform,private fileOpener: FileOpener,
              public permissions: AndroidPermissions, public diagnostic: Diagnostic) {
      this.loader.hide();
      this.platform.ready().then(() => {
      if(!this.platform.is('cordova')) {
        return false;
      }
      if (this.platform.is('ios')) {
        this.storageDirectory = this.file.documentsDirectory+'/download/';
      }
      else if(this.platform.is('android')) {
          this.diagnostic.requestRuntimePermission(this.diagnostic.permission.WRITE_EXTERNAL_STORAGE).then((status) => {
              if (status === this.diagnostic.permissionStatus.GRANTED) {
              } else {
              }
          }, error => {
              console.error('permission error:', error);
          });
          this.storageDirectory = this.file.externalRootDirectory+'/download/';
      }
      else {
        return false;
      }
    });

    this.events.subscribe('message', message => {
      console.log("chat page message", message);
      this.messageRecieve(message);
      console.log("this.msgArray", this.msgArray);
      setTimeout(() => {
        if(this.content._scroll) {
          this.content.scrollToBottom(300);
        }
      }, 0);
    });
    this.storage.get('rutdata').then((getdata) => {
      this.getdata = getdata;
    });

    this.storage.get('reciverJID').then((reciverJID) => {
      this.reciverJID = reciverJID;
      console.log("chatpage init", this.reciverJID);
    });

    this.storage.get('senderJID').then((senderJID) => {
      this.senderJID = senderJID;
      let user = this.senderJID.split('@');
      this.username = user[0];
      console.log('username >>>>>>>>>', this.username);
    });

    this.storage.get("empresaId").then((getempresaID) => {
      this.empresaID = getempresaID;
    });

    this.storage.get("empresa").then((getempresa) =>{
      this.empresa = getempresa;
    });

    this.storage.get("name").then((getname) => {
      this.name = getname;
    });

    this.storage.get("userid").then((id) => {
      this.userID = id;
    });

    this.storage.get("useremail").then((email) => {
      this.userEmail = email;
    });

    this.storage.get("userName").then((name) => {
      this.userName = name;
    });

    this.storage.get("isLogin").then((resulst) => {
      console.log("results login status", resulst);
      if(resulst){
        this.restProvider.getCompanyIconImage(this.empresaID,this.appID)
          .then(data => {
              this.companyLogo = data['urlarchivo'];
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
      } else {
        this.corpocustoHeader = false;
        this.travelAgencyHeader = true;
      }
    });

    this.storage.get("vip").then((vip) => {
        if (vip == true){
            this.vip = "Si";
        }
        else {
            this.vip = "no";
        }

    });

    this.storage.get("cargo").then((cargo) => {
        this.cargo = cargo;
        this.firstMsg = "ENVIOPARAMETROS<>VIP:"+this.vip+"<>Cargo:"+this.cargo+"<><>";
        this.xmppService.sendMessage(this.reciverJID,this.firstMsg);
        console.log("first msgsss", this.firstMsg);
    });

  }

  messageRecieve(msg){
  var from = msg.getAttribute('from');
  var type = msg.getAttribute('type');
  var elems = msg.getElementsByTagName('body');
  var d = new Date();
  var time = d.toLocaleTimeString();
  if (type == "chat" && elems.length > 0) {
    var body = elems[0];
    var textMsg = Strophe.getText(body);
    var transfer = textMsg.split("/");
    console.log('transfer>>>>>>>>>>', transfer[1], transfer[2],transfer[3]);
    var newstate = 2;
    if (transfer[1] == "CHATTRASPASO"){
            this.restProvider.save_massage(this.reciverJID,transfer[3], this.saveMessages)
                .then(datam =>{
                  if(datam['estado'] == 'OK'){
                     this.restProvider.transfer(this.userID, this.username, this.senderJID, transfer[2],transfer[3],this.empresa)
                         .then(success =>{
                           this.name = success['asistente'].nombres;
                          this.restProvider.init_transfer(transfer[3], this.senderJID, newstate)
                              .then(success1 =>{
                                var msge = "/TRANSFERENCIAREALIZADA/"+transfer[3]+"/"+ this.reciverJID;
                                this.reciverJID = transfer[2];
                                this.xmppService.sendMessage(this.reciverJID, msge);
                                let alert = this.alertCtrl.create({
                                  title: 'transfer',
                                  subTitle: "traspasando ejecutivo",
                                  buttons: ['OK']
                                });
                                alert.present();
                                this.storage.set('name', this.name);
                                this.storage.set('reciverJID', transfer[2]);
                              })
                         })
                  }
                }).catch(error =>{
              this.navCtrl.push("MenuPage");
            });
    }
    else {
      if (transfer[1] == "finalizar"){
        this.xmppService.logout();
        this.goback();
      }
      else {
          if (textMsg !== "/PING"){
              var first = "<";
              var sec = "br>";
              var tag = elems[0].textContent.split(first+sec);
              if (tag[1]){
                  var tag1= tag[1].split("'");
                  this.tag2 = tag1[3];
                  var tag3 = tag1[5];
                  textMsg = tag[0]+'<br>'+'<a>'+this.tag2+'</a>';
                  this.messages.push({
                      userId: this.reciverJID,
                      text: textMsg,
                      file: true,
                      downloadUri: tag3,
                      time: time
                  });
                  this.saveMessages.push({
                      idmensaje: time,
                      jid1: this.reciverJID,
                      jid2 : this.senderJID,
                      file: true,
                      downloadUri: tag3,
                      mensaje: textMsg,
                      horaenviomensaje: time
                  });
              }
              else {
                  if (elems[0].textContent == ""){
                      return;
                  }
                  else {
                      this.messages.push({
                          userId: this.reciverJID,
                          text: elems[0].textContent,
                          time: time
                      });
                      this.saveMessages.push({
                          idmensaje: time,
                          jid1: this.reciverJID,
                          jid2 : this.senderJID,
                          mensaje: elems[0].textContent,
                          horaenviomensaje: time
                      });
                  }

              }
          }
          else {
              this.xmppService.sendMessage(this.reciverJID,'/PINGREPLY');
          }
      }
      this.isFile = false;
    }
  }
}

   onFocus() {
    this.showEmojiPicker = false;
    this.content.resize();
    this.scrollToBottom();
  }

  switchEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
    if (!this.showEmojiPicker) {
      this.focus();
    } else {
    }
    this.content.resize();
    this.scrollToBottom();
  }

  sendMsg() {
      if (!this.editorMsg.trim()) return;
      this.xmppService.sendMessage(this.reciverJID, this.editorMsg);
      if (!this.showEmojiPicker) {
          this.focus();
        }
        this.onFocus();
        var d = new Date();
        var time = d.toLocaleTimeString();
        this.toUser = {
          id: this.reciverJID
        };
        this.user = {
          id: this.senderJID
        };
        this.messages.push({
          userId: this.senderJID,
          text: this.editorMsg,
          time: time
        });
        this.saveMessages.push({
          idmensaje: time,
          jid1: this.senderJID,
          jid2 : this.reciverJID,
          mensaje: this.editorMsg,
          horaenviomensaje: time
        });
        this.editorMsg = '';
      }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400)
  }

  private focus() {
    if (this.messageInput && this.messageInput.nativeElement) {
      this.messageInput.nativeElement.focus();
    }
  }

  ionViewDidLoad() {
  }

  goback(){
      this.xmppService.logout();
      this.navCtrl.push(MenuPage);
  }

  fileDownLoad(uri) {
      this.download(uri);
    }

  sendFile() {
      this.fileState = enviaArchivo(1, 0, 0);
    this.interval = setInterval(() => {
      if (this.fileState['URLarchivo'] != null) {
          var msg = "Archivo Recibido<br><a id='" + this.fileState['idUpload'] + "' data-name='" + this.fileState['nombreArchivo'] + "' data-url='" + this.fileState['URLarchivo'] + "' href='" + this.fileState['URLarchivo'] + "'>" + this.fileState['nombreArchivo'] + "</a>";
          var textMsg = "Archivo Enviado"+'<br>'+'<a>'+this.fileState['nombreArchivo']+'</a>';
          this.xmppService.sendMessage(this.reciverJID, msg);
          var d = new Date();
          var time = d.toLocaleTimeString();
          this.messages.pop();
          this.messages.push({
            userId: this.senderJID,
            file: true,
            downloadUri: this.fileState['URLarchivo'],
            text: textMsg,
            time: time
          });
          this.saveMessages.pop();
          this.saveMessages.push({
            idmensaje: time,
            jid1: this.senderJID,
            jid2 : this.reciverJID,
            mensaje: textMsg,
            file: true,
            downloadUri: this.fileState['URLarchivo'],
            horaenviomensaje: time
          });
         this.stopInterval();
      }
      else {
        var msg = "enviando archivo ..."+this.fileState['porcentaje']+"%";
        var d = new Date();
        var time = d.toLocaleTimeString();
        if (this.start == true){
          this.messages.push({
            userId: this.senderJID,
            text: msg,
            time: time
          });
          this.saveMessages.push({
            idmensaje: time,
            jid1: this.senderJID,
            jid2 : this.reciverJID,
            mensaje: msg,
            horaenviomensaje: time
          });
          this.start = false;
        }
        else {
          this.messages.pop();
          this.saveMessages.pop();
          this.messages.push({
            userId: this.senderJID,
            text: msg,
            time: time
          });
          this.saveMessages.push({
            idmensaje: time,
            jid1: this.senderJID,
            jid2 : this.reciverJID,
            mensaje: msg,
            horaenviomensaje: time
          });
        }
      }
    }, 300);
  }

  download(uri){
      const fileTransfer: FileTransferObject = this.transfer.create();
      fileTransfer.download(uri, this.storageDirectory + this.tag2, false).then((entry) => {
          let fileExtn=this.tag2.split('.').reverse()[0];
          let fileMIMEType=this.getMIMEtype(fileExtn);
          this.fileOpener.open(this.storageDirectory+this.tag2, fileMIMEType).then(()=>{
          }).catch((err)=>{
              const alertSuccess = this.alertCtrl.create({
                  title: `Descarga Exitosa! But can't open it by `+err,
                  subTitle: this.tag2,
                  buttons: ['De acuerdo']
              });
              alertSuccess.present();
          });
          }).catch(error=> {
              const alertFailure = this.alertCtrl.create({
                  title: this.storageDirectory+error.source,
                  subTitle: this.tag2+` no fue descargado exitosamente Código de error: ${error.source}`,
                  buttons: ['De acuerdo']
              });
              alertFailure.present();
          });
  }

  getMIMEtype(extn){
        let ext=extn.toLowerCase();
        let MIMETypes={
            'txt' :'text/plain',
            'docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'doc' : 'application/msword',
            'pdf' : 'application/pdf',
            'jpg' : 'image/jpeg',
            'bmp' : 'image/bmp',
            'png' : 'image/png',
            'xls' : 'application/vnd.ms-excel',
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'rtf' : 'application/rtf',
            'ppt' : 'application/vnd.ms-powerpoint',
            'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        }
        return MIMETypes[ext];
    }

  stopInterval(){
      clearInterval(this.interval);
      this.start = true;
  }

}
