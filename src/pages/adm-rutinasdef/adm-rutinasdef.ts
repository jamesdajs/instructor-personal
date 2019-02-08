import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AdmCrearrutinaclientePage} from '../../pages/adm-crearrutinacliente/adm-crearrutinacliente';
import { RutinaProvider} from '../../providers/rutina/rutina';
import { DetallejercicioPage } from '../detallejercicio/detallejercicio'

/**
 * Generated class for the AdmRutinasdefPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adm-rutinasdef',
  templateUrl: 'adm-rutinasdef.html',
})
export class AdmRutinasdefPage {

  items=[]
  ejers={}
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public rutina:RutinaProvider
    ) {
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad AdmRutinasdefPage',this.items);
    this.listarutinas()
  }
  crear(){
    this.navCtrl.push(AdmCrearrutinaclientePage )
  }
  listarutinas(){
  
      this.rutina.verRutinasDefecto()
      .subscribe(list=>{
        list.forEach(element => {
          this.ejers[element.key]=[]
        });
        this.items=list
      },err=>{
        console.log(err)
      })
  }
  convertirfecha(timestamp){
    let fecha=timestamp.toDate()
    return fecha.getDate()+"/"+(fecha.getMonth()+1)+"/"+fecha.getFullYear()
  }
  verejercicios(key){
    //this.navCtrl.push(EjerciciosPage,key)
    if(this.ejers[key].length==0){
      this.rutina.verEjercicios(key)
      .subscribe(list=>{
        this.ejers[key]=list
        console.log(list)
      })
    }else{
      this.ejers[key]=[]
    }
    
  }
  verDetEjercicio(item){
      this.navCtrl.push(DetallejercicioPage,item)
  }
}
