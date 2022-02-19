import { modelLocation } from './../models/modelLocation';
import { Injectable, ElementRef, NgZone } from "@angular/core";
import { } from 'googlemaps';
declare var google: any;


@Injectable()
export class MapsService {  //NO FUNCIONA COMO SERVICIO

  location: modelLocation
  geoCoder;
  searchElementRef: ElementRef;

  constructor(private ngZone: NgZone,
  ) { }


  async loadMap(): Promise<any> {

    this.setCurrentLocation();
    this.geoCoder = new google.maps.Geocoder;
    let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {});

    let response: any = await new Promise((resolve, reject) => {

      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.location.latitude = place.geometry.location.lat();
          this.location.longitude = place.geometry.location.lng();
          this.location.zoom = 12;
          resolve(this.getAddress(this.location.latitude, this.location.longitude));
        });
      });
    });
    return response;
  }

  private setCurrentLocation() {
    var options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 30000
    };

    if ('geolocation' in navigator) {

      navigator.geolocation.getCurrentPosition((position) => {

        this.location.latitude = position.coords.latitude;
        this.location.longitude = position.coords.longitude;
        this.location.zoom = 8;

        this.getAddress(this.location.latitude, this.location.longitude);
      }, (error) => {
      }, options);

    } else {
    }
  }

  async getAddress(latitude, longitude): Promise<any> {
    let response: any = await new Promise((resolve, reject) => {

      this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            this.location.zoom = 12;
            this.location.address = results[0].formatted_address;
            results.forEach(result => {
              if (result.types[0] == 'postal_code') {
                this.location.colonia = result.address_components[1].long_name;
                this.location.entidad = result.address_components[2].long_name;
              }
              if (result.types[0] == 'administrative_area_level_3') {
                this.location.municipio = result.address_components[0].long_name;
              }
            });
            //this.changeDetectorRef.detectChanges();
            resolve(this.location);
          } else {
            window.alert('Sin resultados');
          }
        } else {
          window.alert('Error al cargar el mapa: ' + status);
        }
      });
    });
    return response;
  }
}