import { NgModule, CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, ViewChild } from '@angular/core';
import { NavController, LoadingController, PopoverController, AlertController, ToastController, IonModal } from '@ionic/angular';
import { RedditService } from 'src/providers/reddit-service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LocalService } from 'src/providers/local.service';
import { OpenaiService } from 'src/providers/openai.service';




@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  @ViewChild(IonModal)
  modal!: IonModal;

  public editorValue: string = '';


  
  isSubmitted = false;



  table: string="adduser";
  view:boolean=true;
  push: boolean=false;
  data: any;
  posts: any;
  image:string="";
  title: string="";
  url: string="";
  urlrewiting: string="";
  meta: string="";
  keyword: string="";
  keywords: any;
  deadlineTask: any;
  postdata: any;
  events: any;
  priority: any;

  firstname: any;
  lastname: any;
  email: any;
  password: any;



  user: any;
  namebank: any;
  dombank: any;
  iban: any;
  rib: any;
  bic: any;
  profilid: any;
  profilId: any;

  edit:boolean=false;
  edit2:boolean=false;


  segType: string = 'info';
  indicatif : string = '+33';
  phone: any;
  address: any;
  number:any = '';
  complement: any;
  city: any;
  cp: any;
  siren: any;
  id: any;

  formgroup!: FormGroup;
  validations_form!: FormGroup;
  datestart: Date= new Date();
  content: string="";
  iduser: any;
  phone_mobile: any;
  phone_number: any;
  company: any;
  notes: any;
  country: any;
  state: any;
  salutation: any="M.";
  customer_type: any="business";
  shipping_cp: any;
  shipping_address: any;
  shipping_city: any;
  shipping_state: any;
  shipping_country: any;
  shipping_phone: any;
  billing_phone: any;
  tva_number: any;
  siret_number: any;
  lng: any;
  lat: any;
 
  check1: boolean = false;
  check2: boolean = false;
  check3: boolean = false;
  page!: number;
  per_page!: number;
  order_id: any;
  order_by: any;
  status: any;
  filter: any;
  products: any;
  
  birthdate: any;
  moyendepaiement: any;

  onRegisterForm!: FormGroup;
  onStep1Form!: FormGroup;
  onStep3Form!: FormGroup;
  onStep2Form!: FormGroup;
  onStep4Form!: FormGroup;
  adulte1Form: any;
  adulte1!: { prenom: string; nom: string; adresse: string; cp: string; ville: string; telephone: string; };
  adulte2!: { prenom: string; nom: string; adresse: string; cp: string; ville: string; telephone: string; };
  
  
  category:any=[];
  catresult: any=[];

  form0:boolean=true;
  form1:boolean=false;
  form2:boolean=false;
  form3:boolean=false;
  form4:boolean=false;
  form5:boolean=false;
  vectorID: any;

  constructor(
    public navCtrl: NavController, 
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    private route: ActivatedRoute,
    public formBuilder: FormBuilder,
    public loadingController:LoadingController,  
    public redditService:RedditService, 
    private router: Router,  
    public toastCtrl: ToastController,
    private localStore: LocalService,
    private loadingCtrl: LoadingController,
    private openaiService: OpenaiService) {
   }

  
   ngOnInit() {

    this.createVector_stores(); 
    this.onRegisterForm = this.formBuilder.group({
      firstname: ['', [Validators.required, Validators.minLength(1)]],
      lastname: ['', [Validators.required, Validators.minLength(1)]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      //password2: ['', [Validators.required, Validators.minLength(5)]],
     address: ['', [Validators.required, Validators.minLength(1)]],
     cp: ['', [Validators.required, Validators.minLength(1)]],
     city: ['', [Validators.required, Validators.minLength(1)]],
     phone_mobile: ['', [Validators.required,Validators.minLength(10)]],
     check1: [true, [Validators.requiredTrue]]
   })


   this.adulte1Form = this.formBuilder.group({
    firstname1: ['', [Validators.required, Validators.minLength(1)]],
    lastname1: ['', [Validators.required, Validators.minLength(1)]],
    address1: ['', [Validators.required, Validators.minLength(1)]],
    cp1: ['', [Validators.required, Validators.minLength(1)]],
    city1: ['', [Validators.required, Validators.minLength(1)]],
    phone_mobile1: ['', [Validators.required,Validators.minLength(10)]],
 })


   
   this.onStep2Form = this.formBuilder.group({
    catresult: ['', [Validators.required, Validators.minLength(1)]],
   })


   this.onStep3Form = this.formBuilder.group({
    moyen: ['', [Validators.required, Validators.minLength(1)]],
   })


   this.onStep4Form = this.formBuilder.group({
   check1: [true, []],
   check2: [true, [Validators.requiredTrue]], 
   check3: [true, [Validators.requiredTrue]]
 })


  // this.getAllproducts();
  }



  submitForm(){
    this.isSubmitted = true;
   
    if (this.onRegisterForm.valid) {
     /* console.log(this.calculAge())
      if(this.calculAge()<18){
        this.form0=false;
        this.form1=true;

      }else {
        this.form0=false;
        this.form2=true;
      
      }*/

      this.register();   
     
   }

   this.form0=false;
   this.form4=true;
  }

  submitForm1(){
    if (this.adulte1Form.valid) {
     /// this.register(); 
     this.form1=false;
     this.form2=true;
     this.register();  
   }
  }

  submitForm2(){
   
      this.form2=false;
      this.form3=true;
     /// this.register(); 
   
  }

  submitForm3(){
    if (this.onStep3Form.valid) {
      this.form3=false;
      this.form4=true;
     /// this.register(); 
   }
  }


  submitForm4(){
    if (this.onStep4Form.valid) {
      this.form4=false;
     // this.form5=true; 
     /// this.register(); 

     this.register(); 
     setTimeout(() => { 
       handler: async () => {}
  
     }, 3000); 
   }
  }

   calculateLifeSpan = (birthdateString: string, deathDayString: string): number => {
    const birthdate = new Date(birthdateString);
    const dayOfDeath = new Date(deathDayString);
    let age = dayOfDeath.getFullYear() - birthdate.getFullYear();
    const monthDifference = dayOfDeath.getMonth() - birthdate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && dayOfDeath.getDate() < birthdate.getDate())) {
        age--;
    }
    return age;
}

calculAge(){
    return this.calculateLifeSpan(this.birthdate, new Date().toISOString().slice(0, 10))
}


  async add( event: any, item: any) {
    console.log(item);
    this.catresult.push(item); 
    console.log(this.catresult); 
   // this.router.navigateByUrl('/account/' + item.id);
}



  handleChange() {
    console.log(this.category); 

  }


  get errorControl() {
    return this.onRegisterForm.controls;
  }

  async createVector_stores() {
    this.vectorID=await this.openaiService.createVector_stores(); 
    console.log(this.vectorID); 
   
   }
  

    async  register() {


   

      const loader = await this.loadingController.create({
        message: 'Enregistrement en cours',
        });
        loader.present();
    
      var data = {
        email: this.email,
        password :this.password,
        salutation: this.salutation,
        firstname: this.firstname,
        lastname: this.lastname,
        address: this.address,
        cp:this.cp,
        city: this.city,
        state: this.state,
        country: this.country,
        phone_mobile: this.phone_mobile,
        phone_number: this.phone_number,
        company: this.company,
        customer_type: this.customer_type,
        notes: this.notes,

        shipping_address: this.shipping_address,
        shipping_cp:this.shipping_cp,
        shipping_city: this.shipping_city,
        shipping_state: this.shipping_state,
        shipping_country: this.shipping_country,
        shipping_phone: this.shipping_phone,
        billing_phone: this.billing_phone,
        siret_number: this.siret_number,
        tva_number: this.tva_number,
        role:1,

        lat:this.lat, 
        lng:this.lng, 
        pushid: this.vectorID
      }

           console.log(data); 
             this.redditService.register(data) 
             .toPromise()
             .then(async (response) =>
             {
               console.log(response);

               loader.dismiss();
                 
                const toast = await this.toastCtrl.create({
            cssClass: 'bg-profile',
            message: 'Inscription réussie ',
            duration: 3000,
            position: 'bottom',
      
          });
          toast.present();


          this.router.navigateByUrl('/login');

        })
    }

  }

 



