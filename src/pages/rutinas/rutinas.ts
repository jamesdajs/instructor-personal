import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , LoadingController ,Events,ToastController } from 'ionic-angular';
import { EjerciciosPage } from '../ejercicios/ejercicios';
import { DetallejercicioPage } from '../detallejercicio/detallejercicio';

import { RutinaProvider } from '../../providers/rutina/rutina';

import { Storage } from '@ionic/storage';
/**
 * Generated class for the RutinasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rutinas',
  templateUrl: 'rutinas.html',
})
export class RutinasPage {
  items=[]
  ejers={}
  constructor(public navCtrl: NavController, 
    public navParams: NavParams ,
    public rutina:RutinaProvider,
    public loadCtr:LoadingController,
    public store:Storage,
    public event:Events,
    public toastCtrl: ToastController
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RutinasPage');
    this.listarutinas()
  }
  irPaginainicio(){
    this.event.publish("irAinicio")
  }
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    
      console.log('Async operation has ended');
      setTimeout(()=>{

        this.listarutinasrefres(refresher)
      },1000)
      
    
  }

  selecionarRutina(){
    
    this.navCtrl.push(EjerciciosPage)
  }

  listarutinas(){
    
    this.store.get('key1')
    .then(val=>{
      console.log(val)
      this.rutina.verRutinas(val)
      .subscribe(list=>{
        list.forEach(element => {
          element.fechaini=this.convertirfecha(element.fechaini)
          element.fechafin=this.convertirfecha(element.fechafin)
          this.ejers[element.key]=[]
        });
        this.items=list
        console.log(list)
        console.log(this.ejers)
      })
    })
  }
  listarutinasrefres(ref){
    
    this.store.get('key1')
    .then(val=>{
      console.log(val)
      this.rutina.verRutinas(val)
      .subscribe(list=>{
        list.forEach(element => {
          element.fechaini=this.convertirfecha(element.fechaini)
          element.fechafin=this.convertirfecha(element.fechafin)
          this.ejers[element.key]=[]
        });
        this.items=list
        console.log(list)
        console.log(this.ejers)
        ref.complete()
      })
    })
  }
  convertirfecha(timestamp){
    let fecha=timestamp.toDate()
    return fecha.getDate()+"/"+(fecha.getMonth()+1)+"/"+fecha.getFullYear()
  }
  verejercicios(item){
    //this.navCtrl.push(EjerciciosPage,key)
    if(this.ejers[item.key].length==0){
      this.rutina.verEjercicios(item.key)
      .subscribe(list=>{
        this.ejers[item.key]=list
        console.log(list)
      })
    }else{
      this.ejers[item.key]=[]
    }
    
  }
  verDetEjercicio(key){
      this.navCtrl.push(DetallejercicioPage,key)
  }

  alerta(){
    const toast = this.toastCtrl.create({
      message: 'En esta sección encontrarás tus rutinas asignadas por tu instructor seleccionado',
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();
  }

}
