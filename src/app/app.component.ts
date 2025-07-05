import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, isPlatform, LoadingController, MenuController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from 'src/providers/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateConfigService } from 'src/providers/translate-config.service';
import { Share } from '@capacitor/share';
import { RedditService } from 'src/providers/reddit-service';
import { LocalService } from 'src/providers/local.service';

//import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  iduser: any;
  posts: any;

  ionViewWillEnter(){
    this.getData();

  }
  


  public appClient = [
    { title: 'home', url: '/tabs/home', icon: 'home' },
   // { title: 'map', url: '/tabs/map', icon: 'map' },
   // { title: 'list', url: '/tabs/posts', icon: 'list' },
   // { title: 'services', url: '/tabs/services-list', icon: 'tv' },
    { title: 'Documents', url: '/tabs/files', icon: 'cloud-download' },
    { title: 'Chat', url: '/tabs/chat', icon: 'chatbubbles' },
    { title: 'Profil', url: '/tabs/profil', icon: 'person-circle' },
  //{ title: 'ourstairs', url: '/escales', icon: 'flag' },
  //  { title: 'pictures', url: '/pictures', icon: 'camera' },
  //  { title: 'question', url: '/chatgpt', icon: 'help-circle' },
   // { title: 'settings', url: '/tabs/settings', icon: 'gift' },
   // { title: 'modeemploi', url: '/modeemploi', icon: 'play-circle' },
  //  { title: 'legal', url: '/legal', icon: 'information' },
    
  ];


  
  public labels = ['Divers'];
  firstname: any;
  lastname: any;
  role: any;
  language: string | null;
  platf: string="";

  last_page:number=0;
  per_page:number=20;
  order_id:any="id";
  order_by:any="desc";
  currentpage!: number;
  category:any="";
  status:any="";
  filter:string="";
  showAssitants : boolean =false; 
  constructor(   
    private platform: Platform,
    // private splashScreen: SplashScreen,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public alertController: AlertController,
    private authenticationService: AuthenticationService,
    public menu: MenuController,
    private storage: Storage,
    private translate: TranslateService,
    public redditService:RedditService, 
    private translateConfigService: TranslateConfigService,
    private loadingCtrl: LoadingController,
    private localStore: LocalService,
  
) {
    this.language=this.translateConfigService.getCurrentLang();
    this.initializeApp();
  }

  onMenuOpen() {
    console.log('Menu ouvert');
    console.log(this.authenticationService.isAuthenticated());
   if(this.authenticationService.isAuthenticated()){
    this.getData(); // ou n'importe quelle logique de reload que tu veux faire
    this.showAssitants=true; 
   } else { 
    this.showAssitants=false; 

   }

  }

  async getData(){

    this.iduser=this.localStore.getItem('iduser');
    const loading = await this.loadingCtrl.create({
    message: 'Chargement..',
    spinner: 'bubbles',
  });
  
  this.redditService.getDataBypageByUser(this.iduser,"1","assitantsByUser",this.per_page,this.order_id,this.order_by,this.category,this.status,this.filter).subscribe(data => {
    loading.dismiss();
    console.log(data);
    this.posts=data.data;
  })}  
  


  initializeApp() {

    this.translate.setDefaultLang('fr'); // add this
 //   this.menu.enable(false);

  //  this.router.navigate(['/home']);     
  // this.menu.enable(false, 'menu1');
   this.router.navigate(['/tabs/home']);     

  this.platform.ready().then(() => {



    // 


/*
GoogleAuth.initialize({
  clientId: '377073682209-dhp6lcep2md2i4pamohlad730okhj486.apps.googleusercontent.com',
  scopes: ['profile', 'email'],
  grantOfflineAccess: true,
});
*/


    if (this.platform.is('android')) {

      this.platf="android";
         console.log('android');
    } else if (this.platform.is('ios')) {
         console.log('ios');
         this.platf="ios";
    } else {
         //fallback to browser APIs or
         this.platf="desk";
           }
    });

   
  }

  async login() {
  await this.menu.close();
  this.router.navigateByUrl('/tabs/login');
  }

  async allassistants() {
    await this.menu.close();
    this.router.navigateByUrl('/tabs/chat');
    }

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
     
          this.authenticationService.logout();
           setTimeout(() => { 
       
           
          this.menu.enable(false);
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

  async nextFile( event: any, item: any){
    console.log(item.id); 
      // Ferme le menu


  if( item.category=="chat"){

    this.router.navigateByUrl('/tabs/chatgpt-openai/');
  } else {

    await this.menu.close();
    this.router.navigateByUrl('/tabs/chat-doc/'+item.id);
  }


   }

}
