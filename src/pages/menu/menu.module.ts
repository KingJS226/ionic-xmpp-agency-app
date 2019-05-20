import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MenuPage } from './menu';
import { HeaderComponentModule } from '../../components/header/header.module';

@NgModule({
  declarations: [
    MenuPage,
  ],
  imports: [
    IonicPageModule.forChild(MenuPage),
    HeaderComponentModule
  ],
  exports: [
    MenuPage
  ]
})
export class MenuPageModule {}
