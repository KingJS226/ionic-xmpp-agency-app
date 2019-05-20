import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { map } from 'rxjs/operators/map';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import moment from 'moment';

export class ChatMessage {
  messageId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  toUserId: string;
  hora: number | string;
  mensaje: string;
  status: string;
}

export class UserInfo {
  id: string;
  name?: string;
  avatar?: string;
}

@Injectable()
export class ChatService {

  constructor(private http: HttpClient,
              private events: Events) {
  }

  mockNewMsg(msg) {
    const mockMsg: ChatMessage = {
      messageId: Date.now().toString(),
      userId: 'correos%gearlabs.cl@demo.radeon.cl',
      userName: 'Hancock',
      userAvatar: 'assets/imgs/Marqueta/ad.png',
      toUserId: 'kkskdkskdsk@dkdkdfddk.cl',
      hora: moment().format('LT'),
      mensaje: msg.mensaje,
      status: 'success'
    };

    setTimeout(() => {
      this.events.publish('chat:received', mockMsg, moment().format('LT'))
    }, Math.random() * 1800)
  }

  getMsgList(): Observable<ChatMessage[]> {
    const msgListUrl = './assets/mock/msg-list.json';
    return this.http.get<any>(msgListUrl)
    .pipe(map(response => response.array));
  }

  sendMsg(msg: ChatMessage) {
    return new Promise(resolve => setTimeout(() => resolve(msg), Math.random() * 1000))
    .then(() => this.mockNewMsg(msg));
  }

  getUserInfo(): Promise<UserInfo> {
    const userInfo: UserInfo = {
      id: 'kkskdkskdsk@dkdkdfddk.cl',
      name: 'Luff',
      avatar: 'assets/imgs/Marqueta/dgs.png'
    };
    return new Promise(resolve => resolve(userInfo));
  }

}
