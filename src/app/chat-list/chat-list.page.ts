import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, PopoverController, AlertController, MenuController, LoadingController, NavParams, ToastController, InfiniteScrollCustomEvent, IonModal, ModalController } from '@ionic/angular';
import { RedditService } from 'src/providers/reddit-service';
import { Router } from '@angular/router';
import { OverlayEventDetail } from '@ionic/core/components';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OpenaiService } from 'src/providers/openai.service';
import { LocalService } from 'src/providers/local.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.page.html',
  styleUrls: ['./chat-list.page.scss'],
})
export class ChatListPage implements OnInit {


  modal!: IonModal;

  table: string="locations";
  category:any="";
  id: any;
  pages: any;
  items: any;
  posts: any;
  page:number;
  status:any="";
  filter:string="";
  wordid: any="";
  total:number=0;
  last_page:number=0;
  per_page:number=20;
  order_id:any="id";
  order_by:any="desc";
  currentpage!: number;

  formgroup!: FormGroup;
  validations_form!: FormGroup;
  title: string="";
  UrlImage: string="";
  modelData: any;
  fileId: any;
  idfile: any;
  upladfile: any;
  vectorStoreId: any;
  reponseAttachement: any;
  iduser: any;
  defaut_message: any;
  idfiledb: any;

  format: any;
  base64: any;
  image: any;
  doc: any;
  url: any;
  fileOcr: any;
  responsePDFSAVE: any;
  NewVectorId: any;
  reponseCatgorie: any;
  questionCategorie: any;
  newAssitant: any;
  newthread_id: any;
  reponseInfosdoc: any; 
  constructor
  ( public navCtrl: NavController, 
    private formBuilder: FormBuilder, 
    public alertController: AlertController, 
    public menu: MenuController,
    public loadingController:LoadingController,  
    public redditService:RedditService, 
    private router: Router,  
    public toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    public modalController: ModalController,
    private http: HttpClient,
    private openaiService: OpenaiService,
    private localStore: LocalService,
    private popoverController: PopoverController ) {
    this.page=1;
  }
  ngOnInit() {}


ionViewWillEnter(){

  this.iduser = this.localStore.getItem('iduser');
  this.vectorStoreId=this.localStore.getItem('vectorStoreId');
  this.getData();
}

async getData(){
  const loading = await this.loadingCtrl.create({
  message: 'Chargement..',
  spinner: 'bubbles',
});

this.redditService.getDataBypageByUser(this.iduser,this.page,"assitantsByUser",this.per_page,this.order_id,this.order_by,this.category,this.status,this.filter).subscribe(data => {
  loading.dismiss();
  console.log(data);
  this.posts=data.data;
})}  
  
async nextFile( event: any, item: any){
 console.log(item.id); 
 this.router.navigateByUrl('/chat-doc/'+item.id);
}
    
 
async delete(event: any, item: any) {
  this.idfile=item.id_file;
  this.idfiledb=item.id;


  console.log(this.idfiledb); 
  const loader = await this.loadingController.create({});
  loader.present();

  this.redditService.delete("assistants", this.idfiledb)  
  .toPromise()
  .then((response) =>
  {console.log(response);})
  setTimeout(() => {
    this.getData();
    loader.dismiss();
  }, 2000);
}







async CreateAssistantThreadByFile(){
  var data = JSON.stringify({ 
      vector_store_id: this.vectorStoreId,
      title : this.title, 
      userid :this.iduser, 
      category : "Tous les fichiers"
    });

    console.log(data); 

    this.closePopover(); 
    const loader = await this.loadingController.create({
      message: 'Chargement en cours',
      });
      loader.present();


  this.redditService.addPost("CreateAssistantThreadByFile",data)  
  .subscribe(async (response) => {
    console.log(response); 
  //  this.newAssitant=response.assitantid;  
  //  this.newthread_id=response.thread_id;

    setTimeout(async () => { 
   //   this.loadData(file_id_db); 
      console.log(response.assistant.id);
      loader.dismiss();

      if(response.assistant.category=="chat"){

        this.router.navigateByUrl('/tabs/chatgpt-openai/');
      } else {
    
        await this.menu.close();
        this.router.navigateByUrl('/tabs/chat-doc/'+response.assistant.id);
      }

     }, 1000); 
  })
}




async closePopover() {
  await this.popoverController.dismiss();
}



}
  