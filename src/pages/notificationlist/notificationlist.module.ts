import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationlistPage } from './notificationlist';

@NgModule({
  declarations: [
    NotificationlistPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationlistPage),
  ],
})
export class NotificationlistPageModule {}
