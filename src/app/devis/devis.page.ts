import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavController, PopoverController, AlertController, MenuController, LoadingController, NavParams, ToastController, InfiniteScrollCustomEvent, IonModal, ModalController, ActionSheetController, IonContent } from '@ionic/angular';
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
  selector: 'app-devis',
  templateUrl: './devis.page.html',
  styleUrls: ['./devis.page.scss'],
})
export class DevisPage implements OnInit {


  @ViewChild('scrollArea', { static: false }) content!: IonContent;
  @ViewChild('fileInput', { static: false })
  fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('pageContent', { static: false })

  modal!: IonModal;

  table: string="locations";
  category:any="location";
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


  typedText = '';
  fullText = `Téléchargez votre devis &
          obtenez des réponses
          instantanée.`;
  typingSpeed = 60; // ms par lettre
  isShrunk = false;
  pageContent: any;
  constructor
  ( public navCtrl: NavController, 
    private formBuilder: FormBuilder, 
    public popoverCtrl: PopoverController,
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
    private actionSheetCtrl: ActionSheetController ) {
    this.page=1;
  }
  ngOnInit() {
   this.checkPermissions(); 
  }

  checkPermissions = async () => {
    const permission = await Camera.checkPermissions();
    if (permission.camera === 'denied') {
      const result = await Camera.requestPermissions();
      console.log(result); // might help with debugging
    }
  };


  ionViewWillEnter(){

    this.vectorStoreId=this.localStore.getItem('vectorStoreId');
    this.iduser = this.localStore.getItem('iduser');
    console.log("Vector ID"); 
    console.log( this.vectorStoreId); 
    this.typeWriter(0);
  }




  ionViewDidEnter() {
    this.pageContent.scrollToTop(400); // 400ms d'animation
    this.typedText = '';
    this.typeWriter(0);
    
  }


  onScroll(event: any) {
    const scrollTop = event.detail.scrollTop;
    this.isShrunk = scrollTop > 50;
  }

  typeWriter(index: number) {
    if (index < this.fullText.length) {
      this.typedText += this.fullText.charAt(index);
      setTimeout(() => this.typeWriter(index + 1), this.typingSpeed);
    }
  }
  

  async  addFile(idfile: any) {
    const loader = await this.loadingCtrl.create({
      cssClass: 'ion-loading',
      spinner: 'circular',
      message: "Traitement assitant AI"});
      loader.present();

    var data = JSON.stringify({ 
      id_file:this.idfile,
      id_vector : this.NewVectorId,
      title:this.defaut_message,
      category :this.defaut_message,
      address:this.defaut_message,
      delay:this.defaut_message,
      company_name:this.defaut_message,
      content:this.defaut_message,
      price:this.defaut_message,
      edited_by:this.iduser,
      image:this.image

      });

      console.log(data); 
    this.redditService.addPost("files",data)  
    .subscribe(async (response) => {
      console.log(response); 
      this.responsePDFSAVE=response;

     this.CreateAssistantThreadByFile(response.id_vector); 


     this.search( this.responsePDFSAVE.id_file,this.responsePDFSAVE.id);
      setTimeout(() => { 
        loader.dismiss();
        
       }, 1000); 
    })
    }




    async search(  file_id: any,  file_id_db:any){
      var data = JSON.stringify({ 
        file_id:file_id,
        file_id_db: file_id_db
        });
      console.log(data); 
      this.redditService.addPost("searchCategoryByFileId",data)  
      .subscribe(async (response) => {
        console.log(response); 
        setTimeout(() => { 
     
        
         }, 1000); 
      })
    }
    


    async CreateAssistantThreadByFile(vectorid:any){
      var data = JSON.stringify({ 
          vector_store_id:  vectorid,
          vector_allfiles_id : this.vectorStoreId, 
          userid :this.iduser, 
          category : "devis"
        });
    
        console.log(data); 
    
    
    const loader = await this.loadingController.create({message: 'Chargement en cours'});
          loader.present();
    
    
      this.redditService.addPost("CreateAssistantThreadByQuote",data)  
      .subscribe(async (response) => {
        console.log(response); 
      //  this.newAssitant=response.assitantid;  
      //  this.newthread_id=response.thread_id;
    
        setTimeout(() => { 
       //   this.loadData(file_id_db); 
          console.log(response.assistant.id);
          loader.dismiss();
           this.router.navigateByUrl('/chat-doc/'+response.assistant.id);
         }, 1000); 
      })
    }


selectedFile: File | null = null;


  // Select File
  onFileSelected(event: Event) {
   const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.selectedFile = input.files[0];
      this.uploadFile();
    }
  }

  // Upload File
  async uploadFile() {
    if (!this.selectedFile) {
      alert('Please select a file first.');
      return;
    }

    const loader = await this.loadingController.create({});
    loader.present();
    this.NewVectorId=await this.openaiService.createVector_stores(); 
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    const headers = new HttpHeaders(); // No content type for FormData
    this.http.post("https://www.api1.alpes-solutech.fr/api/public_assitant_uploadfile", formData, { headers }).subscribe(
      async (response) => {
        console.log('File uploaded successfully:', response);
       this.upladfile=  [response]; 
        this.idfile= this.upladfile[0].id; 
        console.log('File ID:', this.idfile);


   
        console.log(this.NewVectorId);
        console.log(this.vectorStoreId);
        this.addFile(this.idfile)
        this.reponseAttachement=this.openaiService.attachFileToVectorStore(this.NewVectorId,  this.idfile);
        //this.reponseAttachement=this.openaiService.attachFileToVectorStore(this.vectorStoreId,  this.idfile);

       // console.log( this.reponseAttachement); 
        setTimeout(() => {
          loader.dismiss();
        }, 2000);
       
      })

    }



  // Upload File
  async uploadFileUrl(fileUrl: string) {

    const loader = await this.loadingController.create({});
    loader.present();
    this.NewVectorId=await this.openaiService.createVector_stores(); 
      try {
        
        // Step 1: Download the file as a Blob
        const response = await fetch(fileUrl);
        console.log('File ID:', response );


        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const fileBlob = await response.blob();
        // Step 2: Convert Blob to File (File API required for OpenAI)
        const file = new File([fileBlob], 'document.pdf', { type: 'application/pdf' });
        console.log(file); 
        // Step 3: Prepare FormData for Upload
        const formData = new FormData();
        formData.append('file', file);


        const headers = new HttpHeaders(); // No content type for FormData
        this.http.post("https://www.api1.alpes-solutech.fr/api/public_assitant_uploadfile", formData, { headers }).subscribe(
          async (response) => {
            console.log('File uploaded successfully:', response);
           this.upladfile=  [response]; 
            this.idfile= this.upladfile[0].id; 
            console.log('File ID:', this.idfile);

            this.addFile(this.idfile)
            this.reponseAttachement=this.openaiService.attachFileToVectorStore(this.NewVectorId,  this.idfile);
            this.reponseAttachement=this.openaiService.attachFileToVectorStore(this.vectorStoreId,  this.idfile);
          })



    
      } catch (error: any) {
        console.error('Error uploading file:', error);
      }
      setTimeout(() => {
     
        loader.dismiss();
      }, 2000);
    }


    async addFormGallery() {
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Base64, // file-based data; provides best performance
        quality: 2, // highest quality (0 to 100)
        source: CameraSource.Photos
        //CameraSource:PHOTOS
      });
       this.format=capturedPhoto.format;
       this.base64=capturedPhoto.base64String;
       var data = JSON.stringify({
       format: this.format,
       base64: this.base64
       });

    this.image="data:image/"+capturedPhoto.format+";base64,"+capturedPhoto.base64String;
     console.log(data);
     this.uploadOcr(); 
          
     const loader = await this.loadingCtrl.create({
      cssClass: 'ion-loading',
      spinner: 'circular',
      message: "Enregistrement de l'image"});
      loader.present();
  
      setTimeout(() => {
        loader.dismiss();
      }, 1000);
  
     }
  
  
     async addFormCamera() {
       const capturedPhoto = await Camera.getPhoto({
       resultType: CameraResultType.Base64,
       quality: 2,
       source: CameraSource.Camera
       });
  
       this.format=capturedPhoto.format;
       this.base64=capturedPhoto.base64String;
       var data = JSON.stringify({
       format: this.format,
       base64:this.base64
       });
       this.image="data:image/"+capturedPhoto.format+";base64,"+capturedPhoto.base64String;
       console.log(data);
       this.uploadOcr(); 

       const loader = await this.loadingCtrl.create({
        cssClass: 'ion-loading',
        spinner: 'circular',
        message: "Enregistrement de l'image"});
        loader.present();
      
      
        setTimeout(() => {
     
          loader.dismiss();
        }, 1000);
      }
  

      async uploadOcr() {

        console.log("------Upload OCR-------"); 
        const loader = await this.loadingCtrl.create({
        cssClass: 'ion-loading',
        spinner: 'circular',
        message: "Traitement OCR"});
        loader.present();
        const formData = new FormData();
        formData.append('apikey', "K86968436988957");
        formData.append('base64Image', this.image);
        formData.append('language', "fre");
        formData.append('isCreateSearchablePdf',"true");
        formData.append('isSearchablePdfHideTextLayer', "true");

        console.log(formData); 
        const headers = new HttpHeaders(); // No content type for FormData
        this.http.post("https://api.ocr.space/parse/image", formData, { headers }).subscribe(
          async (response) => {
          console.log('File uploaded successfully:', [response]);
          this.doc=[response]; 
          console.log(this.doc); 
          console.log(this.doc[0].SearchablePDFURL); 
          this.url=this.doc[0].SearchablePDFURL;
          console.log( this.url); 
        //  this.uploadFileUrl(this.url); 
  
        setTimeout(() => {
          this.selectFileFromUrl(); 
          loader.dismiss();
        }, 1000);
        
            
          
      })
 }




selectFileFromUrl() {
    this.defaut_message="Traitement en cours ..."; 
     var data = JSON.stringify({ 
       url:this.url,
       });
    console.log(data); 
     this.redditService.addPost("public_assitant_uploadFromUrlToCurl",data)  
     .subscribe(async (response) => {
       console.log(response); 

       console.log('File uploaded successfully:', response);
       this.upladfile=  [response]; 
        this.idfile= this.upladfile[0].id; 
        console.log('File ID:', this.idfile);
        this.addFile(this.idfile)
        this.reponseAttachement=this.openaiService.attachFileToVectorStore(this.vectorStoreId,  this.idfile);
       setTimeout(() => { 
   
        this.image=""; 
        }, 1000); 
     })
     
}


async nextFile( event: any, item: any){
this.router.navigateByUrl('/file/'+item.id);
}







downloadAndUploadFile(pdfUrl: string) {
  this.http.get(pdfUrl, { responseType: 'blob' }).subscribe(
    (fileBlob) => {
      console.log('Downloaded file:', fileBlob);
      this.uploadFileToOpenAi(fileBlob);
    },
    (error) => console.error('Download error:', error)
  );
}


uploadFileToOpenAi(fileBlob: Blob) {

    // Extract file name from URL
    const fileName = "newfile2133"; 

    // Prepare FormData
    const formData = new FormData();
    const file = new File([fileBlob], 'document.pdf', { type: 'application/pdf' });
    formData.append('file', file);
  
  //  formData.append('file', file);

    // Upload to server
    const uploadUrl = 'https://www.api1.alpes-solutech.fr/api/public_assitant_uploadfile'; // Change this
    this.http.post(uploadUrl, formData).subscribe(response => {
      console.log('Upload success:', response);
    }, error => {
      console.error('Upload failed:', error);
    });
  } catch (error: any) {
    console.error('Error uploading file:', error);
  }





  


  async presentUploadOptions() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Ajouter un fichier',
      cssClass: 'custom-action-sheet-header',
      buttons: [
        {
          text: 'Depuis les fichiers (PDF)',
          icon: 'document',
          cssClass: 'custom-action-sheet-button document',
          handler: () => {
            this.fileInput.nativeElement.click(); // Déclenche l'input caché
          }
        },
        {
          text: 'Annuler',
          icon: 'close',
          cssClass: 'custom-action-sheet-button document',
          role: 'cancel'
        }
      ]
    });
  
    await actionSheet.present();
  }
  






}
  