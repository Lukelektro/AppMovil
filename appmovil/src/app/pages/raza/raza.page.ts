import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-raza',
  templateUrl: './raza.page.html',
  styleUrls: ['./raza.page.scss'],
})
export class RazaPage implements OnInit {

  constructor(private camera: Camera) { }

  ngOnInit() {
  }


  capturarImagen() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((ImageData) => {
      const base64Image = 'data:image/jpeg;base64,' + ImageData;

      //procesar imagen o subirla afirebase

    }, (err) => {
      console.error(err);
    });
    	
  }

}
