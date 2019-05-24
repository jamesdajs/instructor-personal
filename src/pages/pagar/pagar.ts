import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
/**
 * Generated class for the PagarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-pagar',
	templateUrl: 'pagar.html',
})
export class PagarPage {

	constructor(public navCtrl: NavController, public navParams: NavParams,
		public http: HttpClient) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad PagarPage');
	}
	soap2() {

		// build SOAP reques
		var sr =
			`<?xml version="1.0" encoding="UTF-8"?>
			<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://servicios.comelec.ws.sintesis.com.bo/">
			<SOAP-ENV:Body>
				<ns1:registroPlan>
					<datos>
						<categoriaProducto xsi:type="xsd:string">3</categoriaProducto>
						<codigoComprador xsi:type="xsd:string">231</codigoComprador>
						<codigoRecaudacion xsi:type="xsd:string">JA20160603232902</codigoRecaudacion>
						<correoElectronico xsi:type="xsd:string">hegaro@hegaro.com.bo</correoElectronico>
						<descripcionRecaudacion xsi:type="xsd:string">PAGO Prueba</descripcionRecaudacion>
						<documentoIdentidadComprador/>
						<fecha xsi:type="xsd:integer">20190522</fecha>
						<fechaVencimiento xsi:type="xsd:integer">0</fechaVencimiento>
						<hora xsi:type="xsd:integer">114000</hora>
						<horaVencimiento xsi:type="xsd:integer">0</horaVencimiento>
						<moneda xsi:type="xsd:string">BS</moneda>
						<nombreComprador xsi:type="xsd:string">herlan garzon rodriguez</nombreComprador>
						<planillas>
							<descripcion xsi:type="xsd:string">Pago de prueba</descripcion>
							<montoCreditoFiscal></montoCreditoFiscal>
							<montoPago></montoPago>
							<nitFactura></nitFactura>
							<nombreFactura></nombreFactura>
							<numeroPago xsi:type="xsd:integer">1</numeroPago>
						</planillas>
						<precedenciaCobro xsi:type="xsd:string">N</precedenciaCobro>
						<transaccion xsi:type="xsd:string">A</transaccion>
					</datos>
					<cuenta xsi:type="xsd:string">wshegaro</cuenta>
					<password xsi:type="xsd:string">Wshegaro2019</password>
				</ns1:registroPlan>
			</SOAP-ENV:Body>
			</SOAP-ENV:Envelope>`


		//let headers = new HttpHeaders();
		//headers = headers.append('Content-Type', ' application/soap+xml; charset=utf-8');
		//headers = headers.append("Accept", " application/soap+xml")

		//console.log(headers.get('Content-Type'))
		//this.http.post("http://test.sintesis.com.bo/WSApp-war/ComelecWS?WSDL", sr, { headers: headers })
		//	.subscribe(data => {
		//		console.log(data)
		//	})
		var invocation = new XMLHttpRequest();
		var url = 'http://test.sintesis.com.bo/WSApp-war/ComelecWS?WSDL';
		//var body = '<?xml version="1.0"?><person><name>Arun</name></person>';


		if (invocation) {
			invocation.open('POST', url, true);
			invocation.setRequestHeader('Content-Type', 'text/xml;charset=UTF-8');
			invocation.onreadystatechange=function(event){
				console.log(event)
				console.log(this)
			}
			invocation.send(sr);
		}
		
		

		invocation.onload = function () {
			var results = invocation.responseText;
			console.log(results);
		}

	}
	soap(){
		this.http.get("https://sidipro.herokuapp.com/pagosnet")
		.subscribe(data=>{
			console.log(data)
		})
	}
	
}
