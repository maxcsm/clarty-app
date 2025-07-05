import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, MenuController, ToastController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { RedditService } from 'src/providers/reddit-service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from '../../providers/authentication.service';
import { LocalService } from 'src/providers/local.service';
//import { GooglePlus } from '@ionic-native/google-plus/ngx';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

//import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { OpenaiService } from 'src/providers/openai.service';
import { Plugins } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { SignInWithApple, AppleSignInResponse, ASAuthorizationAppleIDRequest, AppleSignInErrorResponse } from '@awesome-cordova-plugins/sign-in-with-apple/ngx';
import { LegalPage } from '../legal/legal.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})


export class LoginPage implements OnInit {

  email: any;
  password: any;
  token: any;

  public onLoginForm!: FormGroup;
  roleUser: any;
  page!: number;
  table!: string;
  per_page!: number;
  order_id!: string;
  category!: string;
  order_by!: string;
  status!: string;
  filter!: string;
  products: any;
  user_google: any;
  vectorID: any;

  constructor(
    public navCtrl: NavController,
    public menu: MenuController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public LoadingController: LoadingController,
    public formBuilder: FormBuilder,
    public redditService:RedditService,
    private router: Router,
    public alertController: AlertController,
    private storage: Storage,
    private authService: AuthenticationService,
    private localStore: LocalService,
   // private googlePlus: GooglePlus,
    private openaiService: OpenaiService,
    private signInWithApple: SignInWithApple,
    private platform: Platform,
    private modalController: ModalController
  ) { }



  ngOnInit() {
    this.email = this.localStore.getItem('email');
    this.password = this.localStore.getItem('password');

    this.onLoginForm = this.formBuilder.group({
      'email': [null, Validators.compose([
        Validators.required
      ])],
      'password': [null, Validators.compose([
        Validators.required
      ])]
    });
   // GoogleAuth.initialize();
  }




  async goLogin() {

    
    const loader = await this.LoadingController.create({
    message: 'Connexion en cours',
    });
    loader.present();
    var data = JSON.stringify({ 
    email:this.email,
    password: this.password,
    }); 
    
    this.redditService.login(data)
    .subscribe(async (response) => {
    console.log(response);
    setTimeout(() => { 
    loader.dismiss();
    }, 1300); 

    console.log(response.token);


    
  // this.authService.login(response.data);



    this.authService.ifLoggedIn(); 
    const toast = await this.toastCtrl.create({
      cssClass: 'bg-profile',
      message: 'Connexion réussie ',
      duration: 3000,
      position: 'bottom',

    });
    toast.present();
    console.log("------------ROLE ---------"); 
    console.log(response.data.user.role);
    this.roleUser=response.data.user.role;
    this.localStore.saveItem('iduser',response.data.user.id);
    this.localStore.saveItem('role',response.data.user.role);
    this.localStore.saveItem('email',this.email);
    this.localStore.saveItem('password',this.password);
    this.localStore.saveItem('token',response.data.token);
    this.localStore.saveItem('vectorStoreId',response.data.user.pushid);

    if(    response.data.user.payment_reminder!==1){
      console.log("------- accepcter les mentions légales------"); 


      setTimeout(() => { 
        this.openLegalModal(); 
        }, 2000); 
    
   
    }
 
   


    this.getMenu();
 
  if(response.data.user.role==2 ){
    setTimeout(() => { 
        handler: async () => {}
        this.router.navigateByUrl('/tabs');
    }, 2000); 

  } else if (response.data.user.role==1){
    setTimeout(() => { 
      handler: async () => {}
      this.router.navigateByUrl('/tabs');
      }, 2000); 
    }else {
    this.presentAlertError();
  }
    
  },
       error => {    
      console.log(error.message);
       loader.dismiss();
   
      });


    
  }
 

  async goToRegister() {
    this.router.navigateByUrl('/register');
  }

  async forgotPass() {
    this.router.navigateByUrl('/forgotpassword');
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Erreur',
      subHeader: '',
      message: 'E-mail ou mot de passe incorrect',
      buttons: [{
        text: 'Ok',
        cssClass: 'primary',
        handler: (blah) => {
          console.log('Confirm Ok: blah');
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

  async presentAlertError() {
    const alert = await this.alertController.create({
      header: 'Erreur',
      subHeader: '',
      message: 'Identifiant ou mot passe incorrect ',
      buttons: [{
        text: 'Ok',
        cssClass: 'primary',
        handler: (blah) => {
          console.log('Confirm Ok: blah');
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



  getMenu(){
    console.log("------MENU ROLE --------");
    console.log(this.roleUser);
    if(this.roleUser==1){
      this.menu.enable(true, 'menu1');
    }
    if(this.roleUser==2){
      this.menu.enable(true, 'menu2');
    }
    if(this.roleUser==3){
      this.menu.enable(true, 'menu3');
    }
  }




  async loginWithGoogle() {/*
    try {
      const user = await GoogleAuth.signIn();
      console.log('✅ Connecté avec succès :', user);
      this.user_google=[user]; 

      console.log("-------DATA------");
      console.log(this.user_google[0]);

      const userdata = this.user_google[0]; 

      this.loginSocial(userdata );

      // Appelle ton backend ici
    } catch (err: any) {
      if (err?.errorMessage?.includes('canceled') || err?.code === '-5') {
        console.log('ℹ️ Connexion annulée par l’utilisateur');
      } else {
        console.error('❌ Erreur Google Login :', err);
        // Afficher une erreur utilisateur ici
      }
    }
      */
  }



  loginWithTwitter() {
  }

  async loginWithApple() {
    if (!this.platform.is('capacitor') || !this.platform.is('ios')) {
      alert('Disponible uniquement sur appareil iOS');
      return;
    }

    try {
      const res: AppleSignInResponse = await this.signInWithApple.signin({
        requestedScopes: [
          ASAuthorizationAppleIDRequest.ASAuthorizationScopeFullName,
         ASAuthorizationAppleIDRequest.ASAuthorizationScopeEmail
         ]
      });

      setTimeout(() => { 
        handler: async () => {}
        console.log(res); 
        const nom = res.fullName?.familyName || '';
  
        const prenom = res.fullName?.givenName || '';
        const email = res.email || '';
        const userId = res.user;
        const identityToken = res.identityToken;
  
        console.log('Identifiant Apple:', userId);
        console.log('Nom:', nom);
        console.log('Prénom:', prenom);
        console.log('Email:', email);
        console.log('Token:', identityToken);
  
        }, 2000); 

      // ➕ À FAIRE : envoyer à ton serveur ou stocker dans un service utilisateur

    } catch (err) {
      console.error('Erreur Apple Login :', err);
    }
  }











/*
  async loginFacebook2() {
   const result = await FacebookLogin.login({ permissions: ['email', 'public_profile'] });
  
    if (result.accessToken) {
      console.log('Access Token:', result.accessToken.token);

      const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${result.accessToken.token}`);
const data = await response.json();
console.log('Facebook user:', data);
      // Utilise le token pour récupérer les infos utilisateur via Graph API
    } else {
      console.warn('Facebook login failed or cancelled');
    }
  }

*/




/*

  async loginWithFacebook() {
    this.fb.login(['public_profile', 'email'])
      .then(response => {
        console.log('Facebook login success', response);
        const accessToken = response.authResponse.accessToken;
        // Utilise accessToken pour faire des appels à Facebook ou à ton backend
      })
      .catch(error => console.log('Facebook login error', error));
  }

  async loginWithTwitter() {
    const provider = new firebase.auth.TwitterAuthProvider();
    try {
      const result = await firebase.auth().signInWithPopup(provider);
      console.log('Twitter login success', result.user);
    } catch (err) {
      console.error('Twitter login error', err);
    }
  }


*/
  async loginSocial(userdata:any) {

 
    const loader = await this.LoadingController.create({
      message: 'Connexion en cours',
      });

    
        var data = JSON.stringify({ 
          email:userdata.email,
          firstname: userdata.familyName,
          lastname:userdata.givenName,
          pushid: this.vectorID
      
          }); 
    

  
    console.log(data);
    this.redditService.registersocial(data)
    .subscribe(async (response) => {
    console.log(response);
    this.loginData(response)
    loader.dismiss();
  },
       error => {    
      console.log(error.message);
    
   
      });

    }





      async loginData(response:any) {

    this.authService.ifLoggedIn(); 
    const toast = await this.toastCtrl.create({
      cssClass: 'bg-profile',
      message: 'Connexion réussie ',
      duration: 3000,
      position: 'bottom',

    });
    toast.present();
    console.log("------------ROLE ---------"); 
    console.log(response.data.user.role);
    this.roleUser=response.data.user.role;


 
    this.localStore.saveItem('iduser',response.data.user.id);
    this.localStore.saveItem('role',response.data.user.role);
    this.localStore.saveItem('email',this.email);
    this.localStore.saveItem('password',this.password);
    this.localStore.saveItem('token',response.data.token);
    this.localStore.saveItem('vectorStoreId',response.data.user.pushid);
  
   if(response.data.user.pushid==null){
    this.update_pushid(response.data.user.id,response.data.user.pushid )
   }


    this.getMenu();
 
  if (response.data.user.role==1){
    setTimeout(() => { 
      handler: async () => {}
      this.router.navigateByUrl('/tabs');
      }, 200); 
    }else {
    this.presentAlertError();
  }

}




async update_pushid(user_id: any, push_id: any) {
  this.vectorID=await this.openaiService.createVector_stores(); 
  this.localStore.saveItem('vectorStoreId',this.vectorID);
  console.log(this.vectorID); 
  var data = {
    pushid:this.vectorID,

 }
 console.log(data);
 this.redditService.update("users",user_id,data)
 .toPromise()
 .then(async (response) =>
 {
  console.log(response);
})}

 



async openLegalModal() {
  const modal = await this.modalController.create({
    component: LegalPage,
    componentProps: {
      valuePassed: ''
    }
  });

  await modal.present();

  // Attendre la fermeture et récupérer les données (optionnel)
  const { data } = await modal.onDidDismiss();
  console.log('Modal fermé avec:', data);
}




}

