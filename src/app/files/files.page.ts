

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavController, PopoverController, AlertController, MenuController, LoadingController, NavParams, ToastController, InfiniteScrollCustomEvent, IonModal, ModalController, ActionSheetController } from '@ionic/angular';
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
  selector: 'app-files',
  templateUrl: './files.page.html',
  styleUrls: ['./files.page.scss'],
})
export class FilesPage implements OnInit {


  @ViewChild('fileInput', { static: false })
  fileInput!: ElementRef<HTMLInputElement>;
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
  per_page:number=50;
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



  categories = [
    { name: 'Assurance Auto / Moto', icon: '../assets/car.png', isOpen: false },
    { name: 'Assurance Habitation', icon: '../assets/house.png', isOpen: false },
    { name: 'Mutuelle Santé', icon: '../assets/medical.png', isOpen: false },
    { name: 'Assurance Emprunteur', icon: '../assets/money2.png', isOpen: false },
    { name: 'Électricité / Gaz', icon: '../assets/electrical-energy.png', isOpen: false }
  ];


  
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
    this.getData();
    this.vectorStoreId=this.localStore.getItem('vectorStoreId');
    this.iduser = this.localStore.getItem('iduser');
    console.log("Vector ID"); 
    console.log( this.vectorStoreId); 
  }

  
  async getData(){
  const loading = await this.loadingCtrl.create({
  message: 'Chargement..',
  spinner: 'bubbles',
  });

  this.redditService.getDataBypageByUser(this.iduser,this.page,"filesByUser",this.per_page,this.order_id,this.order_by,this.category,this.status,this.filter).subscribe(data => {
  loading.dismiss();
  console.log(data);
  this.posts=data.data;
  })   
  }  
  
  
  ngAfterViewInit() {
    const header = document.getElementById('page-header');
    if (header) {
      setTimeout(() => {
        header.classList.add('visible');
      }, 300); // délai pour un effet fluide
    }
  }





///Gallery 

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


///Camera
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




    /////OCR 

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


  async selectFileFromUrl() {
  this.defaut_message="Traitement en cours ..."; 
   var data = JSON.stringify({ 
     url:this.url,
     });
  console.log(data); 
  this.NewVectorId=await this.openaiService.createVector_stores(); 
   this.redditService.addPost("public_assitant_uploadFromUrlToCurl",data)  
   .subscribe(async (response) => {
     console.log(response); 

     console.log('File uploaded successfully:', response);
     this.upladfile=  [response]; 
      this.idfile= this.upladfile[0].id; 
      console.log('File ID:', this.idfile);
      this.reponseAttachement=this.openaiService.attachFileToVectorStore(this.NewVectorId,  this.idfile);
      this.reponseAttachement=this.openaiService.attachFileToVectorStore(this.vectorStoreId,  this.idfile);



     setTimeout(() => { 

      this.addFile(this.idfile)
      this.getData();

      }, 1000); 
   })
   
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
      console.log("-----Search file ---------------"); 
      console.log("-----this.responsePDFSAVE.id_file ---------------"); 
      console.log(this.responsePDFSAVE.id_file); 
      console.log("-----this.responsePDFSAVE.id ---------------"); 
      console.log(this.responsePDFSAVE.id); 

     // this.responsePDFSAVE.id_file,this.responsePDFSAVE.id
       const responsePDFSAV = this.responsePDFSAVE.id_file; 

       const responsePDFSAVID = this.responsePDFSAVE.id; 
      setTimeout(() => { 
        this.search( responsePDFSAV,responsePDFSAVID);
       }, 1000); 

      setTimeout(() => { 
        loader.dismiss();
        this.image=""; 
        this.getData();
       }, 2000); 
    })
    }



    async askdoc() {
      this.defaut_message="Traitement en cours ..."; 
       var data = JSON.stringify({ 
        file_id:"file-KFvE2nAuCUBMx5vX4BcA9P",
      });
       this.redditService.addPost("askdoc",data)  
       .subscribe(async (response) => {
         console.log(response); 
       })
       }
   


  async findAuthorInFile(event: any, item: any) {
    this.idfile=item.id_file;
    this.idfiledb=item.id;
    const result = await this.openaiService.findAuthorInFile( this.idfile);
    console.log(result); 

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
        this.addFile(this.idfile)
        this.reponseAttachement=this.openaiService.attachFileToVectorStore(this.NewVectorId,  this.idfile);
        this.reponseAttachement=this.openaiService.attachFileToVectorStore(this.vectorStoreId,  this.idfile);

       // console.log( this.reponseAttachement); 
        setTimeout(() => {
          this.getData();
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
        this.getData();
        loader.dismiss();
      }, 2000);
    }








async nextFile( event: any, item: any){
this.router.navigateByUrl('/file/'+item.id);
}



async search(  file_id: any,  file_id_db:any){

  console.log("------SEARCH------"); 

  var data = JSON.stringify({ 
    file_id:file_id,
    file_id_db: file_id_db
    });
  console.log(data); 
  this.redditService.addPost("searchCategoryByFileId",data)  
  .subscribe(async (response) => {
    console.log(response); 
    setTimeout(() => { 
      this.getData();

      this.CreateAssitant(file_id_db)

     }, 1000); 
  })
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





  

  async CreateAssitant(file_id_db: any){
    var data = JSON.stringify({ 
      file_id_db: file_id_db,
      vector_store_id: this.NewVectorId
      });
  
      console.log(data); 
    this.redditService.addPost("searchDataByFileId",data)  
    .subscribe(async (response) => {
      console.log(response); 
      this.newAssitant=response.assitantid;  
      this.newthread_id=response.thread_id;
    console.log(this.reponseCatgorie ); 
      setTimeout(() => { 
        this.loadData(file_id_db); 

       }, 200); 
    })
  }
  



  async loadData(file_id_db: string) {
    this.reponseCatgorie=""; 
    const loader = await this.loadingCtrl.create({
      cssClass: 'ion-loading',
      spinner: 'circular',
      message: "Analyse en cours ..."});
      loader.present();
    console.log(this.newthread_id); 
    console.log(this.newAssitant); 
    console.log( this.NewVectorId); 
    console.log( this.questionCategorie); 
    this.questionCategorie="Quel est la categorie principale du document ? afficher uniquement la catégorie sans phrase "; 
    await this.openaiService.streamThreadQuestion( this.newthread_id, this.newAssitant,  this.NewVectorId, this.questionCategorie,(token) => {
      token = token.replace(/\*\*/g, '');
      this.reponseCatgorie += token;
   })




  setTimeout(() => { 
    this.reponseCatgorie= this.reponseCatgorie.replace('undefined', '');
    console.log("-----***source******----")
    console.log( this.reponseCatgorie); 
    var data = {
      category:this.reponseCatgorie,
    }
    console.log(data); 
    this.redditService.update("files",file_id_db,data) 
    .toPromise()
    .then(async (response) =>
    {  
      
      console.log(response);
      this.getData();
      loader.dismiss();
      this.CreateAssitantByCategory(file_id_db); 
 
    })
}, 900); 
}





async searchInfosdoc(file_id_db: string) {
  this.reponseInfosdoc="";
  const loader = await this.loadingCtrl.create({
    cssClass: 'ion-loading',
    spinner: 'circular',
    message: "Analyse approfondie ..."});
    loader.present();
  console.log(this.newthread_id); 
  console.log(this.newAssitant); 
  console.log( this.NewVectorId); 
  console.log( this.questionCategorie); 
  this.questionCategorie="Repondre au questions sous forme de points.Afficher uniquement les questions et le reponses";
  await this.openaiService.streamThreadQuestion( this.newthread_id, this.newAssitant,  this.NewVectorId, this.questionCategorie,(token) => {
    token = token.replace(/\*\*/g, '');
    this.reponseInfosdoc += token;
 })




setTimeout(() => { 
  this.reponseInfosdoc= this.reponseInfosdoc.replace('undefined', '');
  console.log("-----***source******----")
  console.log( this.reponseCatgorie); 
  var data = {
    content: this.reponseInfosdoc,
  }
  console.log(data); 
  this.redditService.update("files",file_id_db,data) 
  .toPromise()
  .then(async (response) =>
  {console.log(response);
    this.getData();
    loader.dismiss();

    
  })
}, 900); 
}




async CreateAssitantByCategory(file_id_db: any){
  var data = JSON.stringify({ 
    file_id_db: file_id_db,
    vector_store_id: this.NewVectorId, 
    category: this.reponseCatgorie
    });

    console.log(data); 
  this.redditService.addPost("createAssitantByCategory",data)  
  .subscribe(async (response) => {
    console.log(response); 
    this.newAssitant=response.assitantid;  
    this.newthread_id=response.thread_id;
  console.log(this.reponseCatgorie ); 
    setTimeout(() => { 

      this.searchInfosdoc(file_id_db); 
    

     }, 200); 
  })
}




////DELETE
async delete(event: any, item: any) {
  this.idfile=item.id_file;
  this.idfiledb=item.id;
  const loader = await this.loadingController.create({});
  loader.present();

  this.redditService.delete("files", this.idfiledb)  
  .toPromise()
  .then((response) =>
  {
    console.log(response); 

  })

   const result = await this.openaiService.deleteVectorStoreFile(this.vectorStoreId, this.idfile);
   console.log(result); 

  setTimeout(() => {
    this.getData();
    loader.dismiss();
  }, 2000);
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
        text: 'Galerie',
        icon: 'image',
        cssClass: 'custom-action-sheet-button document',
        handler: () => this.addFormGallery()
      },
      {
        text: 'Caméra',
        icon: 'camera',
        cssClass: 'custom-action-sheet-button document',
        handler: () => this.addFormCamera()
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

getFileCount(categoryName: string): number {
  // Vérifier si 'posts' est défini et s'il est un tableau
  if (this.posts && Array.isArray(this.posts)) {
    return this.posts.filter(item => item.category === categoryName).length;
  }
  return 0;  // Si 'posts' est undefined ou vide, on renvoie 0
}

}
  