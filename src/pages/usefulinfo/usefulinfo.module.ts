import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsefulinfoPage } from './usefulinfo';
import { HeaderComponentModule } from '../../components/header/header.module';
import { SelectSearchableModule } from 'ionic-select-searchable';

@NgModule({
  declarations: [
    UsefulinfoPage,
  ],
  imports: [
    IonicPageModule.forChild(UsefulinfoPage),
    HeaderComponentModule,
    SelectSearchableModule
  ],
})
export class UsefulinfoPageModule {}
