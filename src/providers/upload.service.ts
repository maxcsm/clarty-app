import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';


@Injectable({
  providedIn: 'root'
})
export class UploadService {
  selectedImage: string;
  base64Image: string;
  photos: any;
  image: string = "";
  img: any;


  constructor(private camera: Camera) { }


  async accessCamera1() {


    const options: CameraOptions = {
      quality: 80,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 600,
      targetHeight: 400,
      saveToPhotoAlbum: false
    };
    this.img = this.camera.getPicture(options).then(
      imageData => {
        this.base64Image = "data:image/jpeg;base64," + imageData;
        this.image = imageData;

        this.photos.push(this.base64Image);

      },
      err => {
        console.log(err);
      }
    );

    return this.img;
  };


  accessGallery1() {
    const options: CameraOptions = {
      quality: 80,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 600,
      targetHeight: 400,
      saveToPhotoAlbum: false
    };
    this.img = this.camera.getPicture(options).then(
      imageData => {
        this.base64Image = "data:image/jpeg;base64," + imageData;
        this.image = imageData;
        this.photos.push(this.base64Image);

      },

      err => {
        console.log(err);
      }
    );
    return this.img;
  };
}

