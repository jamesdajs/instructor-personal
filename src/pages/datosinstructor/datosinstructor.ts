import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { UsuarioProvider } from "../../providers/usuario/usuario"
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';

declare var google: any;
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
		descorta: "",
		nombregym: '',
		coordenadas:{
			lat:'',
			lng:'',
			zoom:''
		}
	}
	
	
	gmapdir: any
	edad = ""
	key
	estadobut = true
	estado = true
	publicaciones = []
	num = 3
	verdatos = true
	constructor(public navCtrl: NavController,
		public navParams: NavParams,
		public user: UsuarioProvider,
		private loadCtrl: LoadingController,
		private toastCtrl: ToastController,
		private paypal: PayPal
	) {
		this.key = navParams.data


	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad DatosinstructorPage');
		this.cargaDeDatos()
		this.cargarpublicaciones()
		
		//this.loadMa2p()
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
				//this.gmapdir='https://www.google.com/maps/search/?api=1&query='+res.nombregym.replace(/ /g, "+")+'+'+res.ciudad.replace(/ /g, "+")+'+'+res.departamento.replace(/ /g, "+")
				//this.gmapdir=this.sanitize.bypassSecurityTrustResourceUrl('https://www.google.com/maps/embed/search/?api=1&query='+res.nombregym.replace(/ /g, "+")+'+'+res.ciudad.replace(/ /g, "+")+'+'+res.departamento.replace(/ /g, "+"))
				this.datosins = res
				console.log(res);
				this.loadMap()
			})
	}
	cargarpublicaciones(infiniteScroll?) {
		let mes = ["Ene.", "Feb.", "Mar.", "Abr.", "May.", "Jun.", "Jul.", "Ago.", "Sep.", "Oct.", "Nov.", "Dic."]
		let hoy = new Date()
		this.user.listarPublicasionid(this.key, this.num)
			.subscribe(data => {
				data.forEach(element => {
					let prefi = ""
					let diap = element.fecha.toDate()
					if (diap.getDate() == hoy.getDate() &&
						diap.getMonth() == hoy.getMonth() &&
						diap.getFullYear() == hoy.getFullYear()
					)
						prefi = "Hoy "
					else if (diap.getDate() + 1 == hoy.getDate() &&
						diap.getMonth() == hoy.getMonth() &&
						diap.getFullYear() == hoy.getFullYear())
						prefi = "Ayer "
					else prefi = diap.getDate() + " de " + mes[diap.getMonth()]

					element["fecha2"] = prefi + " " + diap.getHours() + ":" + (diap.getMinutes() < 9 ? "0" + diap.getMinutes() : diap.getMinutes())
				});
				let aNuevo = data.length - this.publicaciones.length == 3 ? data.slice(data.length - 3) : data.slice(data.length - (data.length - this.publicaciones.length))
				this.publicaciones = this.publicaciones.concat(aNuevo)
				if (infiniteScroll) infiniteScroll.complete()
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
			this.num = this.num + 3
			this.cargarpublicaciones(infiniteScroll)
		}, 500);
	}
	pagarConpaypal() {
		this.paypal.init({
			PayPalEnvironmentProduction: '',
			PayPalEnvironmentSandbox: 'AU8QPHstn10wwAFRSPR294xmHD3zxqBjysvXsnWNlEVPiE1j4Nx13KKjn6IGoO6aM5d-AGaX7nIt99iu'
		}).then(() => {
			// Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
			this.paypal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
				// Only needed if you get an "Internal Service Error" after PayPal login!
				//payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
				acceptCreditCards: true,
				languageOrLocale: 'es'

			})).then(() => {
				let payment = new PayPalPayment('1.00', 'USD', 'pagoPRO', 'Sale');
				this.paypal.renderSinglePaymentUI(payment).then((data) => {
					// Successfully paid
					console.log(data)
					alert("ok" + JSON.stringify(data))
					// Example sandbox response
					//
					// {
					//   "client": {
					//     "environment": "sandbox",
					//     "product_name": "PayPal iOS SDK",
					//     "paypal_sdk_version": "2.16.0",
					//     "platform": "iOS"
					//   },
					//   "response_type": "payment",
					//   "response": {
					//     "id": "PAY-1AB23456CD789012EF34GHIJ",
					//     "state": "approved",
					//     "create_time": "2016-10-03T13:33:33Z",
					//     "intent": "sale"
					//   }
					// }
				}, (err) => {
					// Error or render dialog closed without being successful
					alert(JSON.stringify(err))
				});
			}, (err) => {
				// Error in configuration
				alert(JSON.stringify(err))
			});
		}, (err) => {
			// Error in initialization, maybe PayPal isn't supported or something else
			alert(JSON.stringify(err))
		});
	}
	loadMap() {

		// This code is necessary for browser
		if(this.datosins.coordenadas){
			console.log(this.datosins)
		let latlng={lat:this.datosins.coordenadas.lat,lng:this.datosins.coordenadas.lng}
		
		let map
		map = new google.maps.Map(document.getElementById('map'), {
			center: latlng,// this.datosins.nombregym+' '+this.datosins.ciudad+' '+this.datosins.departamento,
			zoom: this.datosins.coordenadas.zoom,
			disableDefaultUI: true
		});
		new google.maps.Marker(
			{
				position: latlng,
				map: map,
				title: this.datosins.nombregym
			}
		)}
	}

}
