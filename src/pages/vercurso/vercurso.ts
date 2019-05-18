import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatosinstructorPage } from '../../pages/datosinstructor/datosinstructor';
import { from } from 'rxjs';
import { PagarPage } from '../pagar/pagar';

/**
 * Generated class for the VercursoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vercurso',
  templateUrl: 'vercurso.html',
})
export class VercursoPage {

  key;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  
    this.key=navParams.data
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VercursoPage'+this.key);
  }
  verinstructor(){
    this.navCtrl.push(DatosinstructorPage,this.key);
  }
  suscribirme(){
    this.navCtrl.push(PagarPage);
  }

}
