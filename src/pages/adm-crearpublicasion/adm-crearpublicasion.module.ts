import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdmCrearpublicasionPage } from './adm-crearpublicasion';
import { IonicImageLoader } from 'ionic-image-loader';
@NgModule({
  declarations: [
   // AdmCrearpublicasionPage,
  ],
  imports: [
    IonicPageModule.forChild(AdmCrearpublicasionPage),
    IonicImageLoader
  ],
})
export class AdmCrearpublicasionPageModule {}
