import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { RedditService } from 'src/providers/reddit-service';


import { NavController, PopoverController, AlertController, MenuController, LoadingController, NavParams, ToastController, InfiniteScrollCustomEvent, IonModal, ModalController, IonContent } from '@ionic/angular';

import { Router } from '@angular/router';
import { OverlayEventDetail } from '@ionic/core/components';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateConfigService } from 'src/providers/translate-config.service';
import { OpenaiService } from 'src/providers/openai.service';
import { LocalService } from 'src/providers/local.service';


@Component({
  selector: 'app-chatgpt',
  templateUrl: './chatgpt.page.html',
  styleUrls: ['./chatgpt.page.scss'],
})
export class ChatgptPage  {

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

  constructor(
    public redditService:RedditService, 
    public loadingController:LoadingController,
    private openaiService: OpenaiService,
    private localStore: LocalService
  ) {}


  ionViewWillEnter(){

    this.vectorStoreId=this.localStore.getItem('vectorStoreId');
    setTimeout(() => { 
       this.newThread(); 
      let assistantId=this.assitant_create(this.vectorStoreId); 
      console.log("-------ASSIATNT ID -----------"); 
      console.log(assistantId); 
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

  this.assistantId = "asst_lTTlvk1t0nswVedgMa6OaQ1L"; 
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

else {
  setTimeout(() => { 

    console.log('Il y a un retour à la ligne !');
    this.messages.push({ text: this.aiResponse  , sender: 'ai' });
   
    this.aiResponse = '';
    this.stopSpinner();

}, 8000); 

}})
}



/*
while (this.aiResponse.includes('.')) {




  const parts = this.aiResponse.split('.'); // Diviser la chaîne à chaque point
  const phrase = parts.shift()!.trim(); // Extraire la phrase avant le point

  if (phrase.length > 1) {
    const hasNumbering = /^\s*(\d+[\.\)]|-)\s+/;

        this.fullText += `${phrase}.\n`;
       this.messages.push({ text:  this.fullText  , sender: 'ai' });
        this.fullText = '';
    if (hasNumbering.test(phrase)) {
      // La phrase commence déjà par une numérotation → ne pas renuméroter
      console.log( "La phrase commence déjà par une numérotation"); 
      //this.fullText += `${phrase}.\n`;
      //this.messages.push({ text:  this.fullText  , sender: 'ai' });
      this.fullText = '';
  
    } else {
        // Ajouter un retour à la ligne après chaque phrase
        this.fullText += `${phrase}.\n`;
       // this.messages.push({ text:  this.fullText  , sender: 'ai' });
        //this.fullText = '';
   
    }



  }
*/










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

    console.log(response); 
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





/*

async sendMessage() {

  if (this.userInput.trim() === '') return;


  this.messages.push({ text: this.userInput, sender: 'user' });
  this.userInput = '';
  this.scrollToBottom();



  console.log("-------- Send message -----------")
  const loader = await this.loadingController.create({});
    loader.present();
  var data = JSON.stringify({ 
    message: this.userInput,
    thread_id :this.thread_id
    });
   
  console.log(data);
  this.redditService.addPost("addmessage_chatgpt",data)  
  .subscribe(async (response) => {
   console.log(response); 

   this.askAI(); 
   setTimeout(() => { 
    this.userInput="";
    loader.dismiss();
   }, 2000);


  })

}


async getData() {
this.redditService.getMessagesBythread(this.thread_id).subscribe(data => {
console.log("----REPONSE----"); 
console.log(data); 
this.posts=data.messages.data; 
})

}


async sendMessage1() {


  console.log("-------- Send message -----------")
  const loader = await this.loadingController.create({});
    loader.present();
  var data = JSON.stringify({ 
    message: "Quel est la garantie remboursement en optique ? ",
    thread_id :this.thread_id
    });
   
  console.log(data);
  this.redditService.addPost("addmessage_chatgpt",data)  
  .subscribe(async (response) => {
   console.log(response); 

   this.askAI(); 
   setTimeout(() => { 
    this.userInput="";
    loader.dismiss();
   }, 2000);


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
*/
 
}