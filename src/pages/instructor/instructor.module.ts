import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InstructorPage } from './instructor';

@NgModule({
  declarations: [
    //InstructorPage,
  ],
  imports: [
    IonicPageModule.forChild(InstructorPage),
  ]
})
export class InstructorPageModule {}
