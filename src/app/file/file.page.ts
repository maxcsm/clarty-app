import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RedditService } from 'src/providers/reddit-service';
import { NavController, PopoverController, AlertController, MenuController, LoadingController, NavParams, ToastController, InfiniteScrollCustomEvent, IonModal, ModalController, IonContent } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { OverlayEventDetail } from '@ionic/core/components';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateConfigService } from 'src/providers/translate-config.service';
import { OpenaiService } from 'src/providers/openai.service';
import { LocalService } from 'src/providers/local.service';


@Component({
  selector: 'app-file',
  templateUrl: './file.page.html',
  styleUrls: ['./file.page.scss'],
})
export class FilePage implements OnInit {
  @ViewChild('scrollArea', { static: false }) content!: IonContent;



  
  userInput: string = '';
  response: string = '';
  thread_id: string = '';
  aiResponse = '';
  posts: any;
  messages: any=['Quel est le type d assurance ?'];
  threadId: any;
  assistantId: any;
  vectorID: any;
  vectorStoreId: any;
  assitant_id: any;
  responsedata:any;
  spinner:boolean=false; 
  fullText: string="";
  count: any;
  id: any;
  fileId: any;
  htmlFormattedText: any;
  id_vector: any;
  title: any;
  iduser: any;

  constructor(
    public redditService:RedditService, 
    public loadingController:LoadingController,
    private openaiService: OpenaiService,
    private localStore: LocalService,
    private route: ActivatedRoute,
    private router: Router
  ) {}



  ngOnInit() {
    this.iduser = this.localStore.getItem('iduser');
    this.route.params.subscribe(params => {
       this.id=params['id']; 
       this.getdata(); 
      });
    }



    async getdata() {
      this.redditService.getByid("files", this.id).subscribe(data=>{
        console.log(data); 
          this.posts = [data];
          this.fileId= this.posts.id_file; 
          this.id_vector= this.posts[0].id_vector; 
          this.title= this.posts[0].title; 
          this.htmlFormattedText = this.posts[0].content.replace(/\n/g, '<br>');
    
        })
      }




 


  ionViewWillEnter(){

   // this.vectorStoreId=this.localStore.getItem('vectorStoreId');
    setTimeout(() => { 
       //this.newThread(); 
      //let assistantId=this.assitant_create(this.vectorStoreId); 
      //console.log("-------ASSIATNT ID -----------"); 
      //console.log(assistantId); 
  }, 200); 
   

  }

  scrollToTop() {
    this.content.scrollToBottom(500); // 500ms for smooth scroll
  }

  async getSpinner() {
    this.spinner=true; 

  }

  async stopSpinner() {
    this.spinner=false; 

  }

async askAI() {
  this.getSpinner();
  this.aiResponse = '';
  this.messages.push({ text: this.userInput, sender: 'user' });
  
/*
  if (!this.threadId) {
    this.threadId = await this.openaiService.createThread();
  }
*/

///  this.assistantId = "asst_lTTlvk1t0nswVedgMa6OaQ1L"; 
 // await this.openaiService.sendMessageToThread(this.threadId, this.userInput);



 console.log("-----this.thread_id--------"); 
console.log(this.thread_id); 

console.log("-----this.assistantId--------"); 
console.log(this.assistantId); 




console.log("-----vectoretId--------"); 
console.log(this.vectorStoreId); 
await this.openaiService.streamThreadResponse( this.thread_id, this.assistantId,  this.vectorStoreId, this.userInput,(token) => {
    
//const regex = /(\d+)\.\s([^\.]+)/g;

token = token.replace(/\*\*/g, '');
this.aiResponse += token;
console.log(this.aiResponse); 
console.log("-----***source******----")

if (this.aiResponse.includes('\n')) {
  console.log('Il y a un retour à la ligne !');
  this.messages.push({ text: this.aiResponse  , sender: 'ai' });
  this.aiResponse = '';
  this.stopSpinner();
  this.scrollToTop(); 
 // }
  this.userInput="";
} 
})
}

  // Vérifier si la réponse contient une source
  checkForSource(response: string): boolean {
    const sourcePattern = /†source】./;
    return sourcePattern.test(response);
  }



  searchForAnySource(response: string): boolean {
    const sourcePattern = /\[\d+:\d+†source\]/;
    return sourcePattern.test(response);
  }

scrollToBottom() {
  setTimeout(() => {
    this.content.scrollToBottom(300);
  }, 100);
}





async assitant_create(vectorStoreId: any) {
  var data = JSON.stringify({ 
    vector_store_id:this.vectorStoreId,
    });
   
  console.log(data);
  this.redditService.addPost("assitant_create",data)  
  .subscribe(async (response) => {
    console.log("ASSITANTCREATE --------------"); 
   console.log(response["response "].id   ); 
   this.assistantId=response["response "].id;
  })

}


async newThread() {
  var data = JSON.stringify({
    vectorStoreId: this.vectorStoreId
  });
  this.redditService.addPost("newthread_chatgpt",data)  
  .subscribe(async (response) => {
   console.log(response.thread_id); 
   this.thread_id =response.thread_id;
  })
}

async searchCategory() {
  var data = JSON.stringify({
    file_id: this.vectorStoreId
  });
  this.redditService.addPost("searchCategoryByFileId",data)  
  .subscribe(async (response) => {
   console.log(response.thread_id); 
   this.thread_id =response.thread_id;
  })
}


async askAIWithoutFile() {
  setTimeout(() => { 
    this.userInput = '';
   }, 2000);
  this.aiResponse = '';
  await this.openaiService.streamChatCompletion(this.userInput, (token) => {
    this.aiResponse += token;
  });
}




async CreateAssistantThreadByFile(){
  var data = JSON.stringify({ 
      vector_store_id: this.id_vector,
      title : this.title, 
      userid :this.iduser, 
      category : "fichier"
    });

    console.log(data); 


    const loader = await this.loadingController.create({
      message: 'Chargement en cours',
      });
      loader.present();


  this.redditService.addPost("CreateAssistantThreadByFile",data)  
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


 
}