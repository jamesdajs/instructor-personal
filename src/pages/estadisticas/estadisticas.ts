import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the EstadisticasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-estadisticas',
  templateUrl: 'estadisticas.html',
})
export class EstadisticasPage {
  data =[
    {
      'name': 'Germany',
      'value': 31229
    },
    {
      'name': 'United States',
      'value': 19869
    },
    {
      'name': 'France',
      'value': 21359
    },
    {
      'name': 'United Kingdom',
      'value': 20598
    },
    {
      'name': 'Spain',
      'value': 56009
    },
    {
      'name': 'Italy',
      'value': 24090
    }
  ];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EstadisticasPage');
  }

}
