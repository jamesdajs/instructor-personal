import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatosinstructorPage } from '../../pages/datosinstructor/datosinstructor';
import { PagarPage } from '../pagar/pagar';

declare var google: any;

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

  item;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  
    this.item=navParams.data
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VercursoPage',this.item);
    this.loadMap()
  }
  verinstructor(key){
    this.navCtrl.push(DatosinstructorPage,key);
  }
  suscribirme(){
    this.navCtrl.push(PagarPage);
  }
  loadMap() {

		// This code is necessary for browser
		if(this.item.coordenadas){
			console.log(this.item)
		let latlng={lat:this.item.coordenadas.lat,lng:this.item.coordenadas.lng}
		
		let map
		map = new google.maps.Map(document.getElementById('mapcurso'), {
			center: latlng,// this.datosins.nombregym+' '+this.datosins.ciudad+' '+this.datosins.departamento,
			zoom: this.item.coordenadas.zoom,
			disableDefaultUI: true
		});
		new google.maps.Marker(
			{
				position: latlng,
				map: map,
				title: this.item.nombregym
			}
		)}
	}
}
