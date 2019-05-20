import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PasswordPage } from './password';
import { FooterComponentModule } from '../../components/footer/footer.module';

@NgModule({
  declarations: [
    PasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(PasswordPage),
    FooterComponentModule
  ],
})
export class PasswordPageModule {}
