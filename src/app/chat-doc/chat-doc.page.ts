import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RedditService } from 'src/providers/reddit-service';
import { NavController, PopoverController, AlertController, MenuController, LoadingController, NavParams, ToastController, InfiniteScrollCustomEvent, IonModal, ModalController, IonContent } from '@ionic/angular';

import { ActivatedRoute, Router } from '@angular/router';
import { OverlayEventDetail } from '@ionic/core/components';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateConfigService } from 'src/providers/translate-config.service';
import { OpenaiService } from 'src/providers/openai.service';
import { LocalService } from 'src/providers/local.service';
import { HttpClient } from '@angular/common/http';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';


@Component({
  selector: 'app-chat-doc',
  templateUrl: './chat-doc.page.html',
  styleUrls: ['./chat-doc.page.scss'],
})
export class ChatDocPage implements OnInit {


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
  vector_id: any;
  title: any;
  historiques: any;
  sender: any;
  category: any;
  iduser: any;
  corrections: any[] = [];
  text = '';
  isListening = false;
  matches: string[] = [];
  constructor(
    public redditService:RedditService, 
    public loadingController:LoadingController,
    private openaiService: OpenaiService,
    private localStore: LocalService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private speechRecognition: SpeechRecognition
  ) {}


  ionViewWillEnter(){

    this.iduser = this.localStore.getItem('iduser');
    this.vectorStoreId=this.localStore.getItem('vectorStoreId');
    this.userInput=""; 
  }

  async ngOnInit() {

    const loader = await this.loadingController.create({
      message: 'Chargement en cours',
      });
      loader.present();
    this.route.params.subscribe(params => {
       this.id=params['id']; 
       this.getdata(loader); 
      });
    }



    async getdata(loader: HTMLIonLoadingElement) {
      this.redditService.getByid("assistants", this.id).subscribe(data=>{
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
        this.historiques=data.messages.data.reverse(); 
        if(this.historiques.length<1&&this.category=="devis"){
          this.userInput="Répondre à mes questions consernant le devis ?";
          this.askAI();
        } else {
          this.historiques.forEach(async (data: any) => {
            let datatext=data.content[0].text.value;
            this.aiResponse =  datatext.replace(/\*\*/g, '');
            this.messages.push({ text: this.aiResponse  , sender:data.role});
            this.scrollToBottom(); 
          
          });
      }
    

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

async runAI() {
  this.getSpinner();
  this.aiResponse = '';
  this.messages.push({ text: this.userInput, sender: 'user' });
await this.openaiService.streamThreadSaveQuestion( this.thread_id,  this.assitant_id,  this.vector_id, this.userInput,(token) => {
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
} 


})
}



async runAssitant() {
  this.getSpinner();
  this.aiResponse = '';
  this.messages.push({ text: this.userInput, sender: 'user' });
await this.openaiService.streamThreadSaveQuestion( this.thread_id,  this.assitant_id,  this.vector_id, this.userInput,(token) => {
//const regex = /(\d+)\.\s([^\.]+)/g;

token = token.replace(/\*\*/g, '');
console.log(token); 
this.aiResponse += token;
console.log(this.aiResponse); 
console.log("-----***source******----")

if (this.aiResponse.includes('\n')) {
  this.messages.push({ text: this.aiResponse  , sender: 'assistant' });
  this.scrollToBottom(); 
  this.aiResponse = '';
  this.stopSpinner();
 // }
  this.userInput="";
} 

})
}


async askAI() {
  console.log("-------- Send message -----------")
  const loader = await this.loadingController.create({});
    loader.present();
  var data = JSON.stringify({ 
    content: this.userInput,
    thread_id :this.thread_id
    });
   
  this.update(this.userInput); 

  this.redditService.addPost("addMessageToThread",data)  
  .subscribe(async (response) => {
   console.log(response); 

   setTimeout(() => { 
   this.runAI(); 
    this.userInput="";
    if( this.isListening){
      this.stopListening(); 
    }
    loader.dismiss();
   }, 200);


  })

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





async CreateAssistantThreadByFile(){
  var data = JSON.stringify({ 
      vector_store_id: this.vectorStoreId,
      title : this.title, 
      userid :this.iduser, 
      category : "Tous les fichiers"
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

/*

onInputChange() {
  // Ne corrige que quand u
  // 
  //n mot est terminé (espace à la fin)

  console.log(" CHANGE ----")
  if (!this.userInput.endsWith(' ')) return;

  const words = this.userInput.trim().split(/\s+/);
  const lastWord = words[words.length - 1];

  if (lastWord.length < 2) return; // Ignore petits mots (ex: "le", "de", etc.)

  this.correctWord(lastWord, words.length - 1);
}
*/


correctWord(word: string, index: number) {

    
  var data = JSON.stringify({ 
    text : this.userInput, 
  });
    this.redditService.addPost("languagetool",data)  
    .subscribe(async (response) => {
      console.log(response ); 
      this.corrections = response.matches.map((m: any) => ({
        word: m.context.text.substr(m.context.offset, m.length),
        offset: m.offset,
        length: m.length,
        suggestions: m.replacements.slice(0, 6).map((r: any) => r.value),
        message: m.message
      }));
});
  }


  onInputChange() {


    console.log(" CHANGE ----")
    if (!this.userInput.endsWith(' ')) return;
  
    const words = this.userInput.trim().split(/\s+/);
    const lastWord = words[words.length - 1];
  
    if (lastWord.length < 2) return; // Ignore petits mots (ex: "le", "de", etc.)
  

    this.correctWord(lastWord, words.length - 1);


  }
  





applySuggestion(err: any, suggestion: string) {
  const before = this.userInput.slice(0, err.offset);
  const after =this.userInput.slice(err.offset + err.length);
  this.userInput= before + suggestion + after;

  // Supprimer les suggestions appliquées
  this.corrections = this.corrections.filter(c => c.offset !== err.offset);
}



async startListening() {
  if (this.isListening) {
    console.warn('La reconnaissance est déjà en cours');
    return; // ne pas relancer
  }

  try {
    const permission = await this.speechRecognition.requestPermission();
  
      this.isListening = true;
      this.speechRecognition.startListening({
        language: 'fr-FR',
        showPopup: true,
        showPartial: true,
      }).subscribe(
        (matches: string[]) => {
          this.matches = matches;
          this.isListening = true;
          console.log('Résultat:', matches);
          this.userInput= matches[0]; 
        },
        (error) => {
          console.error('Erreur reconnaissance vocale :', error);
          this.isListening = false;
        }
      );
    
  } catch (err) {
    console.warn('Permission refusée', err);
    this.isListening = false;
  }
}


stopListening() {
  this.isListening = false;
  this.speechRecognition.stopListening();

}


}



 
