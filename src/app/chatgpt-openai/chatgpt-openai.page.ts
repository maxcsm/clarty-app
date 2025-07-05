

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
  selector: 'app-chatgpt-openai',
  templateUrl: './chatgpt-openai.page.html',
  styleUrls: ['./chatgpt-openai.page.scss'],
})
export class ChatgptOpenaiPage {


  @ViewChild('scrollArea', { static: false }) content!: IonContent;

  userInput: string = '';
  response: string = '';
  thread_id:any;
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
  vector_id: any;
  title: any;
  historiques: any;
  sender: any;
  category: any;
  iduser: any;
  assistant_id: any;

  constructor(
    public redditService:RedditService, 
    public loadingController:LoadingController,
    private openaiService: OpenaiService,
    private localStore: LocalService,
    private route: ActivatedRoute,
    private router: Router
  ) {}


  async ionViewWillEnter(){

    this.iduser = this.localStore.getItem('iduser');

    this.thread_id = this.localStore.getItem('thread_id');
    this.assistant_id = this.localStore.getItem('assistant_id');

    if( this.thread_id ==null || this.assistant_id==null ){
     this.CreateAssistant(); 

    } else {
     // const loader = await this.loadingController.create({
     //   message: 'Chargement en cours',
     //   });
     //   loader.present();
     // this.getdata(loader); 

    }
  }




  async getdata(loader: HTMLIonLoadingElement) {
    this.redditService.getByid("assistants",   this.assistant_id ).subscribe(data=>{
      console.log(data); 
        this.posts = [data];
        this.title= this.posts[0].title; 
        this.vector_id= this.posts[0].id_vector; 
        this.assitant_id= this.posts[0].assitant_id; 
        this.thread_id= this.posts[0].thread_id; 
        this.category= this.posts[0].category; 
       this.getHistorique(loader); 
    
      })
    }
 
    

      async getHistorique(loader: HTMLIonLoadingElement) {
        this.redditService.getMessagesBythread(this.thread_id).subscribe(data => {
        loader.dismiss();
        console.log(data); 
        this.historiques=data.messages.data.reverse(); 

        console.log("----LOG CATEGORY-------"); 
        console.log(this.historiques.length); 
        console.log(this.category); 

          this.historiques.forEach(async (data: any) => {
            let datatext=data.content[0].text.value;
            this.aiResponse =  datatext.replace(/\*\*/g, '');
            this.messages.push({ text: this.aiResponse  , sender:data.role});
            this.scrollToBottom(); 
          
          });
      
    

})
      
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









async update(question:any) {
  var data = {
   title:question,
 }
 console.log(data);
 this.redditService.update("assistants", this.id,data)
 .toPromise()
 .then(async (response) =>
 {
  console.log(response);

})}


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




async askAI() {
  console.log("-------- Send message -----------")
  const loader = await this.loadingController.create({});
    loader.present();
  var data = JSON.stringify({ 
    content: this.userInput,
    thread_id :this.thread_id
    });
   
  console.log(data);
  this.update(this.userInput); 
  this.redditService.addPost("addMessageToThread",data)  
  .subscribe(async (response) => {
   console.log(response); 
   setTimeout(() => { 
   this.runAI(); 
    this.userInput="";
    loader.dismiss();
   }, 200);


  })

}




async runAI() {
  this.getSpinner();
  this.aiResponse = '';
  this.messages.push({ text: this.userInput, sender: 'user' });
await this.openaiService.streamThreadSaveQuestionWithoutFile( this.thread_id,  this.assistant_id, this.userInput,(token) => {
//const regex = /(\d+)\.\s([^\.]+)/g;

token = token.replace(/\*\*/g, '');
console.log(token); 
this.aiResponse += token;
console.log(this.aiResponse); 
console.log("-----***source******----")

if (this.aiResponse.includes('\n')) {
  console.log('Il y a un retour à la ligne !');
  this.messages.push({ text: this.aiResponse  , sender: 'assistant' });
  this.scrollToBottom(); 
  this.aiResponse = '';
  this.stopSpinner();

 // }
  this.userInput="";
} else {
  setTimeout(() => {
    console.log('Il y a un retour à la ligne !');
    this.messages.push({ text: this.aiResponse  , sender: 'ai' });
    this.aiResponse = '';
    this.stopSpinner();
}, 8000); 
}

})
}


async CreateAssistant(){
  var data = JSON.stringify({ 
      title : this.title, 
      userid :this.iduser, 
      category : "chat"
    });
    console.log(data); 
    const loader = await this.loadingController.create({
      message: 'Chargement en cours',
      });
      loader.present();
  this.redditService.addPost("assitant_create_withoutfile",data)  
  .subscribe(async (response) => {
    setTimeout(() => { 


      console.log(response);
      console.log(response.assistant.id);

      this.thread_id=response.thread_id;  
      this.assistant_id=response.assitantid;  


      this.localStore.saveItem('thread_id', this.thread_id);
      this.localStore.saveItem('assistant_id',this.assistant_id );



      loader.dismiss();
     }, 1000); 
  })
}





 
}