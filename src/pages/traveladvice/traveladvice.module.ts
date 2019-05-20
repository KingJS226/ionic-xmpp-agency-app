import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TraveladvicePage } from './traveladvice';
import { HeaderComponentModule } from '../../components/header/header.module';

@NgModule({
  declarations: [
    TraveladvicePage,
  ],
  imports: [
    IonicPageModule.forChild(TraveladvicePage),
    HeaderComponentModule
  ],
})
export class TraveladvicePageModule {}
