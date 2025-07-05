import { NgModule, CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, ViewChild } from '@angular/core';
import { NavController, LoadingController, PopoverController, AlertController, ToastController, IonModal, ModalController } from '@ionic/angular';
import { RedditService } from 'src/providers/reddit-service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OverlayEventDetail } from '@ionic/core/components';
import { MenuController } from '@ionic/angular';

import { LocalService } from 'src/providers/local.service';
import { AuthenticationService } from 'src/providers/authentication.service';
@Component({
  selector: 'app-legal',
  templateUrl: './legal.page.html',
  styleUrls: ['./legal.page.scss'],
})
export class LegalPage implements OnInit {
  iduser: any;
    constructor
    ( public navCtrl: NavController, 
      private formBuilder: FormBuilder, 
      public popoverCtrl: PopoverController,
      public alertController: AlertController, 
      public loadingController:LoadingController,  
      public redditService:RedditService, 
      private router: Router,  
      public toastCtrl: ToastController,
      private loadingCtrl: LoadingController, 
      private localStore: LocalService,
      private authService: AuthenticationService,
      private menu: MenuController,
      private modalController: ModalController
   
) {
       
    }

  ngOnInit() {

    this.iduser = this.localStore.getItem('iduser');
  }





  async update_legal() {

 
 
    var data = {
      payment_reminder:1,
  
   }
   console.log(data);
   this.redditService.update("users",  this.iduser,data)
   .toPromise()
   .then(async (response) =>
   {
    console.log(response);
    this.closeModal(); 
  })}
  



  closeModal() {
    this.modalController.dismiss({
      // Tu peux envoyer des données au parent ici si tu veux
      dismissed: true,
    });
  }
}
