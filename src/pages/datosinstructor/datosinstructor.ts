import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { UsuarioProvider } from "../../providers/usuario/usuario"

/**
 * Generated class for the DatosinstructorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-datosinstructor',
	templateUrl: 'datosinstructor.html',
})

export class DatosinstructorPage {
	datos = {
		email: "",
		nombre: "",
		foto: "",
		peso: null,
		altura: 0,
		telefono: 0,
		genero: null,
		fechanac: null,

	}
	datosins = {
		deslarga: "",
		cursos: "",
		descorta: ""
	}
	edad = ""
	key
	estadobut = true
	estado = true
	publicaciones = []
	num=3
	constructor(public navCtrl: NavController,
		public navParams: NavParams,
		public user: UsuarioProvider,
		private loadCtrl: LoadingController,
		private toastCtrl: ToastController
	) {
		this.key = navParams.data
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad DatosinstructorPage');
		this.cargaDeDatos()
		this.cargarpublicaciones()
	}
	solicitud() {
		let load = this.loadCtrl.create({
			content: "Enviando solicitud...",
		})
		load.present()
		let instructor_cliete = {
			fullname: this.datos.nombre,
			foto: this.datos.foto,
			descorta: this.datosins.descorta,
			estado: false,
			idinstructor: this.key,
			rol: "cliente"
		}
		this.user.veriduser()
			.then(idcli => {
				instructor_cliete["idcliente"] = idcli
				this.user.leermisdatosPromesa()
					.then(datos => {
						instructor_cliete["fullnamecli"] = datos.nombre
						instructor_cliete["fotocli"] = datos.foto
						this.user.guardarSolicitud(instructor_cliete)
							.then(() => {
								load.dismiss()
								this.toastCtrl.create({
									message: 'Solicitud enviada correctamente',
									duration: 3000
								}).present()
							})
						console.log(datos)
					})
			})

	}
	cargaDeDatos() {
		this.user.versihaysolicitud(this.key)
			.subscribe(datos => {
				if (datos.length != 0) {
					this.estadobut = false
					if (datos[0].estado == true)
						this.estado = false
				}
				console.log(this.estadobut, this.estado)

			})
		//console.log(this.key)
		this.user.leerOtrosdatos(this.key)

			.subscribe(res => {
				this.datos = res
				this.edad = this.convertirfecha(res.fechanac)
			})
		this.user.leerOtrosdatosinstructor(this.key)
			.subscribe(res => {
				//console.log(res)
				this.datosins = res
			})
	}
	cargarpublicaciones(infiniteScroll?){
		let mes=["Ene.","Feb.","Mar.","Abr.","May.","Jun.","Jul.","Ago.","Sep.","Oct.","Nov.","Dic."]
    	let hoy=new Date()
		this.user.listarPublicasionid(this.key,this.num)
		.subscribe(data=>{
			this.publicaciones=data
			data.forEach(element => {
				let prefi=""
				let diap=element.fecha.toDate()
				if(diap.getDate()==hoy.getDate() && 
				diap.getMonth()==hoy.getMonth() &&
				diap.getFullYear()==hoy.getFullYear()
				)
				  prefi="Hoy "
				else if(diap.getDate()+1==hoy.getDate() && 
				diap.getMonth()==hoy.getMonth() &&
				diap.getFullYear()==hoy.getFullYear())
				  prefi="Ayer "
				else prefi=diap.getDate()+" de "+mes[diap.getMonth()]
		
				element["fecha2"]=prefi+" "+ diap.getHours()+":"+(diap.getMinutes()<9?"0"+diap.getMinutes():diap.getMinutes())
			  });
			if(infiniteScroll)infiniteScroll.complete()
		})
	}
	convertirfecha(timestamp) {
		if (timestamp) {
			let fecha = timestamp.toDate()
			return fecha.getDate() + "-" + (fecha.getMonth() < 9 ? "0" + (fecha.getMonth() + 1) : (fecha.getMonth() + 1)) + "-" + fecha.getFullYear()
		} else {
			return null
		}
	}
	doInfinite(infiniteScroll) {
		console.log('Begin async operation');
	
		setTimeout(() => {
		  this.num=this.num+3
		  this.cargarpublicaciones(infiniteScroll)
		}, 500);
	  }
}
