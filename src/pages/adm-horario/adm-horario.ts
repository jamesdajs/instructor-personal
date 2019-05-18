import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { UsuarioProvider } from '../../providers/usuario/usuario';

/**
 * Generated class for the AdmHorarioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adm-horario',
  templateUrl: 'adm-horario.html',
})
export class AdmHorarioPage {

  horario = []

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public user: UsuarioProvider,
    public toastController: ToastController
  ) {
    let dias = ["Domingo", 'Lunes', "Martes", 'Miercoles', 'jueves', 'Viernes', 'Sabado']
    for (let i in dias) {
      this.horario.push({
        nombre: dias[i],
        horas: [
          {
            cantidad:1,
            inicio: "08:00",
            fin: '09:00'
          }
        ]
      })
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdmHorarioPage');
  }
  guardar() {
    this.user.guardarhorario({ horarios: this.horario })
      .then(() => {
        this.toastController.create({
          message: 'Se creo correctamente el horario',
          duration: 2000
        }).present()
        this.navCtrl.pop()
      })

  }
  aumentarhoras(_this) {
    _this.push({
      cantidad:1,
      inicio: "08:00",
      fin: '09:00'
    })
  }
  quitarhoras(_this){
    _this.pop()
  }
}
