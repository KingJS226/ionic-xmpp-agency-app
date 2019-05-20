import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PassportloginPage } from './passportlogin';
import { HeaderComponentModule } from '../../components/header/header.module';

@NgModule({
  declarations: [
    PassportloginPage,
  ],
  imports: [
    IonicPageModule.forChild(PassportloginPage),
    HeaderComponentModule
  ],
})
export class PassportloginPageModule {}
