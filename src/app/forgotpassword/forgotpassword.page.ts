import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { NavController, MenuController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { RedditService } from 'src/providers/reddit-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.page.html',
  styleUrls: ['./forgotpassword.page.scss'],
})

export class ForgotpasswordPage implements OnInit {

  public onRegisterForm!: FormGroup;
  formgroup!: FormGroup;
  new: string="";
  email: string = "";

  id: any;
  hide=0;

  constructor( 
    
    public navCtrl: NavController, 
    public menuCtrl: MenuController,
    public redditService: RedditService,
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    private router: Router,
    private storage: Storage) {
    this.email;
  }

  ngOnInit() {
    this.onRegisterForm = this.formBuilder.group({
      'email': [null, Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])]
    });

  }




    ionViewWillEnter() {
 
    this.menuCtrl.enable(false);
 
  }

  validation_messages = {
   
    'email': [
      { type: 'required', message: 'Email est requis.' },
      { type: 'pattern', message: 'Entrez un email valide' }
    ]
  };





  async sendnewwpassword(){

    var data = JSON.stringify({
      email: this.email,
    });
    


    if(this.hide<1){
      this.hide=this.hide+1
  

    this.redditService.forgetpassword(data).toPromise()
    .then(async (response) => {




        const alert = await this.alertController.create({
          header: 'Nouveau mot de passe',
          message: 'Consultez votre boite e-mail.',
          buttons: ['OK']
        });
    
        await alert.present();
 
    //  this.storage.set('password',"");
      setTimeout(() => {
        this.router.navigateByUrl('/login');
       }, 300);



})    
  }}

  

}
