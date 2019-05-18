import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdmAlumnosPage } from './adm-alumnos';

@NgModule({
  declarations: [
    AdmAlumnosPage,
  ],
  imports: [
    IonicPageModule.forChild(AdmAlumnosPage),
  ],
})
export class AdmAlumnosPageModule {}
