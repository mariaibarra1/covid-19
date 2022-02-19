import { Component, ViewChild, ElementRef } from '@angular/core';

declare const google;

@Component({
	selector: 'google-maps',
	templateUrl: 'google-maps.html'
})
export class GoogleMapsComponent {

	@ViewChild('map') mapRef: ElementRef;
	public map: any;
	public markers: any = [];
	public poligonos: any = [];

	//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	public ngOnInit() {
		this.loadMap();
	}

	//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	public agregarMarcador(marcador: any) {
		this.markers.push(marcador);
	}

	//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// Al dar click sobre un marcador en el mapa, se monstrará un texto.
	public agregarEventoMarcador(marcador: any, texto: string) {
		let infowindow = new google.maps.InfoWindow({
			content: texto
		});

		google.maps.event.addListener(marcador, 'click', function () {
			infowindow.open(this.mapComponent, marcador);
		});
	}

	//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// Si no se tiene un ícono personalizado, se pasa como parámetro null y se pondrá el marcador por default de google-maps
	public crearMarcador(latLng: any, icono?: any, content?: any) {
		let marker: any;
		if (icono == null) {
			marker = new google.maps.Marker({
				map: this.map,
				animation: google.maps.Animation.DROP,
				position: latLng,

			});
		} else {
			marker = new google.maps.Marker({
				map: this.map,
				icon: icono,
				animation: google.maps.Animation.DROP,
				position: latLng,

			});
		}


		return marker;
	}
	//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	public borrarMarcadores() {
		for (var i = 0; i < this.markers.length; i++) {
			this.markers[i].setMap(null);
		}
		this.markers = [];
	}

	//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	public calcularDistanciaEntre2Puntos(lat1: number, lng1: number, lat2: number, lng2: number) {
		let rad = function (x) { return x * Math.PI / 180; }
		var R = 6378.137; //Radio de la tierra en km
		var dLat = rad(lat2 - lat1);
		var dLong = rad(lng2 - lng1);
		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c;
		return Number(d.toFixed(3)); //Retorna tres decimales
	}

	//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	public crearIconoMarcador(nombreIcono: string, anchura: number = 40, altura: number = 40) {
		var icono = {
			url: "assets/imgs/" + nombreIcono + ".png", // url
			scaledSize: new google.maps.Size(anchura, altura), // scaled size
			origin: new google.maps.Point(0, 0), // origin
			anchor: new google.maps.Point(0, 0) // anchor
		};
		return icono;
	}

	//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	public dibujarMarcadores() {
		for (var i = 0; i < this.markers.length; i++) {
			this.markers[i].setMap(this.map);
		}
	}

	//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	public centrarMarcador(latitud: number, longitud: number) {
		this.map.setCenter(new google.maps.LatLng(latitud, longitud));
	}

	//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	public loadMap() {
		// Coordenadas apuntado al centro de hermosillo por default, cuando se cargue la ubicación (si está activaba esto cambiará).
		let latLng = new google.maps.LatLng(19.397982, -99.147909);

		let mapOptions = {
			center: latLng,
			zoom: 12,
		}

		this.map = new google.maps.Map(this.mapRef.nativeElement, mapOptions);
		google.maps.event.addDomListener(window, 'load', mapOptions);
	}

	//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	public deCoordenadasADireccion(latitud: number, longitud: number) {
		var geocoder = new google.maps.Geocoder;
		let latlng = new google.maps.LatLng(latitud, longitud);

		return new Promise<any>((resolve, reject) => {
			geocoder.geocode({ 'location': latlng }, function (results, status) {
				if (status === 'OK') {
					resolve(results[0].formatted_address);
				} else {
					reject(null);
				}
			});
		});
	}

	//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	public zoomAPunto(latitud: number, longitud: number, offset?: number) {

		if (offset == null)
			offset = 0.002;

		var bounds = new google.maps.LatLngBounds();
		bounds.extend(new google.maps.LatLng(latitud + offset, longitud + offset));
		bounds.extend(new google.maps.LatLng(latitud - offset, longitud - offset));

		this.map.fitBounds(bounds);
	}

	//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// las coordenadas deben de estar como .lat y .lng
	public zoomArregloCoordenadas(lstCoordenadas: any) {
		var bounds = new google.maps.LatLngBounds();
		for (let i = 0; i < lstCoordenadas.length; i++) {
			bounds.extend(new google.maps.LatLng(lstCoordenadas[i].lat, lstCoordenadas[i].lng));
		}
		this.map.fitBounds(bounds);
	}

	//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// lstCoordenadas = [{lat: 0, lng: 0}]
	public pintarPoligono(poligono: any) {
		poligono.setMap(this.map);
		this.poligonos.push(poligono);
	}

	//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// lstCoordenadas = [{lat: 0, lng: 0}]
	public crearPoligono(lstCoordenadas: any, fillColor: string = "#C7C7C7") {
		var poligono = new google.maps.Polygon({
			paths: lstCoordenadas,
			strokeColor: fillColor,
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: fillColor,
			fillOpacity: 0.35
		});
		return poligono;
	}

	//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	public borrarPoligonos() {
		for (let i = 0; i < this.poligonos.length; i++) {
			this.poligonos[i].setMap(null);
		}
		this.poligonos = [];
	}

	//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	public borrarPoligono(poligono: any) {
		poligono.setMap(null);
	}
	//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	public zoomArregloCoordenadasSitios(lstCoordenadas: any) {
		var bounds = new google.maps.LatLngBounds();
		for (let i = 0; i < lstCoordenadas.length; i++) {
			bounds.extend(new google.maps.LatLng(lstCoordenadas[i].Latitud, lstCoordenadas[i].Longitud));
		}
		this.map.fitBounds(bounds);
	}
}
