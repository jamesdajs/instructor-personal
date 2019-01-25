import { Component } from '@angular/core';
import { IonicPage, NavController ,Events} from 'ionic-angular';


import { DatospersonalesPage } from '../datospersonales/datospersonales';
import { TabsPage } from '../tabs/tabs';
import { AdmTipoejercicioPage } from '../adm-tipoejercicio/adm-tipoejercicio';
import { AdmTipodietaPage } from '../adm-tipodieta/adm-tipodieta';
import { AdmClientesPage } from '../adm-clientes/adm-clientes';
/**
 * Generated class for the InstructorPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-instructor',
  templateUrl: 'instructor.html'
})
export class InstructorPage {
  recursivo(){
    this.event.subscribe('cambiar a alumno',(val)=>{
      
      console.log(val)
      this.navCtrl.setRoot(TabsPage)
      this.event.unsubscribe("cambiar a alumno",()=>{
          this.recursivo()
      })
      //if(val)
       // this.navCtrl.setRoot(this.navCtrl.getActive().component)
        
    })
  }

  tabRoot  = AdmClientesPage
  tab1Root = AdmTipoejercicioPage;
  tab2Root = AdmTipodietaPage;
  tab4Root = DatospersonalesPage

  constructor(public navCtrl: NavController,public event:Events) {
    event.subscribe('cambiar a alumno',(val)=>{
      
      console.log(val)
      navCtrl.setRoot(TabsPage)
      event.unsubscribe("cambiar a alumno",()=>{
         this.recursivo()
        })
      })
    }
}

