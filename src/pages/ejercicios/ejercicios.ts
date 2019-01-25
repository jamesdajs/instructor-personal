import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,LoadingController} from 'ionic-angular';
import { DetallejercicioPage } from '../detallejercicio/detallejercicio';
import { RutinaProvider } from '../../providers/rutina/rutina';


/**
 * Generated class for the EjerciciosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ejercicios',
  templateUrl: 'ejercicios.html',
})
export class EjerciciosPage {
  keyrut
  items
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public rutina:RutinaProvider,
    public loadCtr:LoadingController
    
    ) {
      this.keyrut=this.navParams.data
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EjerciciosPage');
    this.listarejercicios()
  }
  
  selecionarEjer(){
    this.navCtrl.push(DetallejercicioPage)
  }
  listarejercicios(){
    let loading = this.loadCtr.create({
      content: 'Cargando datos...'
    })
    loading.present()
    this.rutina.verEjercicios(this.keyrut)
    .subscribe(list=>{
      this.items=list
      console.log(list)
      loading.dismiss()
    })
  }
  verEjercicio(idejercicio){
    this.navCtrl.push(DetallejercicioPage,idejercicio)
  }

}
