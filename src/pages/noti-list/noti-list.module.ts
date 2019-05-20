import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotiListPage } from './noti-list';

@NgModule({
  declarations: [
    NotiListPage,
  ],
  imports: [
    IonicPageModule.forChild(NotiListPage),
  ],
})
export class NotiListPageModule {}
