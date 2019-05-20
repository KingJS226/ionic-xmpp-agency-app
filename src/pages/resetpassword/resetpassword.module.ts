import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResetpasswordPage } from './resetpassword';
import { HeaderComponentModule } from '../../components/header/header.module';

@NgModule({
  declarations: [
    ResetpasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(ResetpasswordPage),
    HeaderComponentModule
  ],
})
export class ResetpasswordPageModule {}
