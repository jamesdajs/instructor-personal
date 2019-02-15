import { Component } from '@angular/core';
import {NavController,App,Events} from 'ionic-angular';
import { RutinasPage } from '../rutinas/rutinas';
import { DietasPage } from '../dietas/dietas';
import { EstadisticasPage } from '../estadisticas/estadisticas';
import { DatospersonalesPage } from '../datospersonales/datospersonales';
import { InstructoresPage } from '../instructores/instructores';
import { LoginPage } from '../login/login';
import { InstructorPage } from '../instructor/instructor';
//import { UsuarioProvider } from '../../providers/usuario/usuario';

import { SplashScreen } from '@ionic-native/splash-screen';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  valor=true
  tabRoot = InstructoresPage;
  tab1Root = RutinasPage;
  tab2Root = DietasPage;
  tab3Root = EstadisticasPage;
  tab4Root = DatospersonalesPage

  constructor( public event:Events,
    public navCtrl:NavController,app:App,
    public splash:SplashScreen
    ) {
    event
    .subscribe('irAinicio',()=>{
      navCtrl.setRoot(LoginPage)
      //this.cargaDeDatos()
    })
    
    event.subscribe('recargarTabs',(val)=>{
      
      console.log(val)
      //navCtrl.setRoot(TabsPage)
      //if(val)
       // this.navCtrl.setRoot(this.navCtrl.getActive().component)
        
    })
    event.subscribe('cambiar a instructor',(val)=>{
      
      console.log(val)
      navCtrl.setRoot(InstructorPage)
      //if(val)
       // this.navCtrl.setRoot(this.navCtrl.getActive().component)
        
    })
    
    
  }
  ionViewDidLoad(){

    this.splash.hide()
  }
}
