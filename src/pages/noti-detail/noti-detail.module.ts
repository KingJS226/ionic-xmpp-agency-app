import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotiDetailPage } from './noti-detail';

@NgModule({
  declarations: [
    NotiDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(NotiDetailPage),
  ],
})
export class NotiDetailPageModule {}
