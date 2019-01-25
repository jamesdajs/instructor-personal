import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DietasPage } from './dietas';

@NgModule({
  declarations: [
    //DietasPage,
  ],
  imports: [
    IonicPageModule.forChild(DietasPage),
  ],
})
export class DietasPageModule {}
