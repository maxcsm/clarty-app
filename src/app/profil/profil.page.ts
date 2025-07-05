import { NgModule, CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, ViewChild } from '@angular/core';
import { NavController, LoadingController, PopoverController, AlertController, ToastController, IonModal } from '@ionic/angular';
import { RedditService } from 'src/providers/reddit-service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OverlayEventDetail } from '@ionic/core/components';
import { MenuController } from '@ionic/angular';

import { LocalService } from 'src/providers/local.service';
import { AuthenticationService } from 'src/providers/authentication.service';
  
@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage  {
    role: any;
    posts: any;
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
      private menu: MenuController
   
) {
       
    }


    async ionViewWillEnter() {
      this.role = this.localStore.getItem('role');
      this.iduser = this.localStore.getItem('iduser');
    }





    async delete() {
      const alert = await this.alertController.create({
        header: "Supprimer mon compte ",
        message: "Voulez-vous vraiment ?",
        buttons: [
          {
            text: "Annuler",
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
            }
          }, {
            text: "Oui",
            handler: () => {
              setTimeout(() => {
                this.update();
  
  
              }, 1000);
            }
          }]
      });
      await alert.present();
    }
    async update() {
      var data = {
       email_verified_at:"",
     }
     console.log(data);
     this.redditService.update("users",this.iduser,data)
     .toPromise()
     .then(async (response) =>
     {
      console.log(response);
      setTimeout(() => {
      this.authService.logout()
      }, 1000);
  })}



  async updatePro() {
    var data = {
     role:2,
   }
   console.log(data);
   this.redditService.update("users",this.iduser,data)
   .toPromise()
   .then(async (response) =>
   {
    console.log(response);
    setTimeout(() => {
    this.authService.logout()
    }, 1000);
})}



async logout() {


  const alert = await this.alertController.create({
    header: 'Déconnexion',
    subHeader: '',
    message: 'Voulez-vous vraiment déconnecter ?',
    buttons: [{
      text: 'Ok',
      cssClass: 'primary',
      handler: (blah) => {
        console.log('Confirm Ok: blah');
   
        this.authService.logout();
         setTimeout(() => { 
     
         

         this.router.navigateByUrl('/login');
       }, 1000); 
      }
    },
    {
      text: 'Annuler',
      cssClass: 'secondary',
      handler: (blah) => {
        console.log('Confirm Cancel: blah');
      }
    }
  ]
  });

  await alert.present();
}


openMenu() {

  this.menu.enable(true, 'menu1');

}

}

