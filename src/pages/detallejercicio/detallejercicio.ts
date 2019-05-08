import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';

import { RutinaProvider } from '../../providers/rutina/rutina';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { AdmModejercicioPage } from '../adm-modejercicio/adm-modejercicio';

import { Storage } from '@ionic/storage';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { WheelSelector } from '@ionic-native/wheel-selector';
import { HistorialejerciciosPage } from '../historialejercicios/historialejercicios';
/**
 * Generated class for the DetallejercicioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-detallejercicio',
    templateUrl: 'detallejercicio.html',
})
export class DetallejercicioPage {
    setejercicio = []
    itemcompleto
    item = {
        nombre: "",
        deslarga: "",
        linkyoutube: "",
        imagenes: [],
        tipo: ""
    }
    youtubeaux: SafeResourceUrl
    alumno = false
    imagenaux = true
    setrealizado = false
    dummyJson = {

        peso: [
            { description: 'Peso', value: '' }
        ],
        rep: [
            { description: 'Repeticiones', value: '' }
        ],
        tiempo: [
            { description: 'Tiempo', value: '' }
        ]


    }
    constructor(public navCtrl: NavController, public navParams: NavParams, public rutina: RutinaProvider,
        public storage: Storage, public user: UsuarioProvider,
        private toastCtrl: ToastController,
        public sanitizer: DomSanitizer,
        private toasCtrl: ToastController,
        private selector: WheelSelector,
        private loadCtrl: LoadingController
    ) {
        this.itemcompleto = this.navParams.data

        for (let i in this.navParams.data.peso) {

            this.setejercicio.push({
                peso: this.navParams.data.peso[i],
                repeticiones: this.navParams.data.repeticiones[i],
                tiempo: this.navParams.data.tiempo[i],
                estado: false
            })
        }
        this.storage.get("rol")
            .then(rol => {
                if (rol == "alumno") {
                    this.alumno = true
                    this.rutina.versetdeHoy(this.itemcompleto.idejercicio, this.itemcompleto.idrutina)
                        .subscribe(sethoy => {
                            if (sethoy.length != 0) this.setrealizado = true
                            console.log(sethoy)
                        })
                }

            })
        for (let i = 2.5; i <= 120; i = i + 2.5)
            this.dummyJson.peso.push({ description: i + ' Kg', value: '' + i })
        for (let i = 1; i <= 50; i++)
            this.dummyJson.rep.push({ description: i + '', value: '' + i })
        for (let i = 5; i <= 60; i = i + 5)
            this.dummyJson.tiempo.push({ description: i + ' min', value: '' + i })
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad DetallejercicioPage', this.youtubeaux);
        this.verdetalle()


    }
    editar(item) {
        this.navCtrl.push(AdmModejercicioPage, item)
    }

    verdetalle() {
        if (this.itemcompleto.idejercicio) {
            this.rutina.verDetalleEjercicios(this.itemcompleto.idejercicio)
                .subscribe(data => {
                    
                    this.item = data
                    if (this.item.linkyoutube != "" && this.item.linkyoutube)
                        this.youtubeaux = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/" + /[^/]+$/.exec(this.item.linkyoutube)[0])
                })
        } else {

            this.item = this.itemcompleto
            if (this.item.linkyoutube != "" && this.item.linkyoutube)
                this.youtubeaux = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/" + /[^/]+$/.exec(this.item.linkyoutube)[0])

        }

    }
    guardarset() {
        const load = this.loadCtrl.create({
            content: 'Guardando sets del ejercicio...'
        })

        let encontrado = this.setejercicio.find(function (element) {
            return element.estado == true;
        });
        console.log(encontrado)
        if (encontrado) {
            load.present()
            let peso = [], repeticiones = [], tiempo = []
            for (let i in this.setejercicio) {
                if (this.setejercicio[i].estado) {
                    peso.push(this.setejercicio[i].peso)
                    repeticiones.push(this.setejercicio[i].repeticiones)
                    tiempo.push(this.setejercicio[i].tiempo)
                }
            }
            let copy = Object.assign({}, this.itemcompleto);
            copy.peso = peso
            copy.repeticiones = repeticiones
            copy.tiempo = tiempo
            this.user.modificarRutina_ejercicio(this.itemcompleto.key, { estado: true })
                .then(() => {
                    delete copy.key
                    let f = new Date();
                    let fecha = (f.getMonth() + 1) + "/" + f.getDate() + "/" + f.getFullYear()
                    console.log(fecha)
                    copy.fecha = new Date(fecha)
                    this.rutina.crearsetsdeEjercicio(copy)
                        .then(res => {
                            load.dismiss()
                            console.log(res)
                            this.navCtrl.pop()
                        })
                })
        } else if (this.setrealizado) {
            this.toastCtrl.create({
                message: "El ejercicio ya se realizo el dia de hoy",
                duration: 3000
            }).present()
        } else {
            this.toastCtrl.create({
                message: "Tienen que realizar al menos un set",
                duration: 3000
            }).present()
        }


    }
    marcarset(e, o) {
        console.log(e)
        this.setejercicio[o].estado = e.checked
    }
    modificarset(i, peso, rep, tiempo) {
        console.log(!this.setrealizado, " y ", this.alumno)
        if (!this.setrealizado && this.alumno) {
            //alert("hola")
            let i_peso, i_rep, i_tiempo
            for (let indice in this.dummyJson.peso) {
                if (peso == this.dummyJson.peso[indice].value) {
                    i_peso = indice;
                }
            }
            for (let indice in this.dummyJson.rep) {
                if (rep == this.dummyJson.rep[indice].value) {
                    i_rep = indice;
                }
            }
            for (let indice in this.dummyJson.tiempo) {
                if (tiempo == this.dummyJson.tiempo[indice].value) {
                    i_tiempo = indice;
                }
            }
            this.selector.show({
                title: "Modificar set " + (i + 1),

                displayKey: 'description',
                items: [
                    this.dummyJson.peso,
                    this.dummyJson.rep,
                    this.dummyJson.tiempo
                ],
                positiveButtonText: "Aceptar",
                negativeButtonText: "Cancelar",

                wrapWheelText: true,
                defaultItems: [
                    { index: 0, value: this.dummyJson.peso[parseInt(i_peso)].description },
                    { index: 1, value: this.dummyJson.rep[parseInt(i_rep)].description },
                    { index: 2, value: this.dummyJson.tiempo[parseInt(i_tiempo)].description }
                ]
            }).then(
                result => {
                    if (this.dummyJson.peso[result[0].index].value != '' ||
                        this.dummyJson.rep[result[1].index].value != '' ||
                        this.dummyJson.tiempo[result[2].index].value != '') {
                        this.setejercicio[i].peso = this.dummyJson.peso[result[0].index].value
                        this.setejercicio[i].repeticiones = this.dummyJson.rep[result[1].index].value
                        this.setejercicio[i].tiempo = this.dummyJson.tiempo[result[2].index].value
                    } else {
                        this.toasCtrl.create({
                            message: "El set tiene que tener al menos un valor",
                            duration: 3000
                        }).present()
                    }
                    //alert( `${result[0].description} (value=${this.dummyJson.peso[result[0].index].value} `);

                },
                err => console.log('Error: ' + JSON.stringify(err))
            )
        }

    }
    IrAhistorial() {
        this.navCtrl.push(HistorialejerciciosPage, { item: this.item, ejercicio: this.itemcompleto })
    }
}
