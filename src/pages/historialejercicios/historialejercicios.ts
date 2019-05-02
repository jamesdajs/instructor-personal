import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RutinaProvider } from '../../providers/rutina/rutina';

/**
 * Generated class for the HistorialejerciciosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-historialejercicios',
  templateUrl: 'historialejercicios.html',
})
export class HistorialejerciciosPage {
ejercicio
datos=[]
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private rutina:RutinaProvider) {
    this.ejercicio=navParams.data
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistorialejerciciosPage',this.ejercicio);
    this.verHistorial()
  }
  verHistorial(){
    let mes=["Ene.","Feb.","Mar.","Abr.","May.","Jun.","Jul.","Ago.","Sep.","Oct.","Nov.","Dic."]
    let dias=["Dom","Lun","Mar","Mie","Jue","Vie","Sab"]
    this.rutina.verHistorial(this.ejercicio.ejercicio.idejercicio)
    .subscribe(data=>{
      data.forEach(element => {
        let dia=element.fecha.toDate()
        element["fechacon"]=`${dias[dia.getDay()]} ${dia.getDate()} de ${mes[dia.getMonth()]} del ${dia.getFullYear()} `
        element["sets"]=[]
        for(let i in element.peso){
          
          element.sets.push({
            peso:element.peso[i],
            repeticiones:element.repeticiones[i],
            tiempo:element.tiempo[i]
          })
        }
      });
      this.datos=data
      console.log(data)
    })
  }
}
