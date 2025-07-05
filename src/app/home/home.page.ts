import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonContent, LoadingController, MenuController, ModalController, NavController, PopoverController, ToastController } from '@ionic/angular';
import { RedditService } from 'src/providers/reddit-service';
import { LocalService } from 'src/providers/local.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateConfigService } from 'src/providers/translate-config.service';
import { register } from 'swiper/element/bundle';

register();
import Swiper from 'swiper';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit, AfterViewInit {

  isShrunk = false;


  @ViewChild('scrollArea', { static: false }) content!: IonContent;
  @ViewChildren('scrollItem', { read: ElementRef }) scrollItems!: QueryList<ElementRef>;
  showModal = false;
  showPopup = false;


  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;


  @ViewChild('pageContent', { static: false })
  pageContent!: IonContent;
  lat!: number;
  lng!: number;
  location:boolean=false; 
  locationButton:boolean=false; 
  table: string = "users";
  iduser!: any;
  posts: any;
  role: any;
  id: any;
  language: any="";
  slider: any;
  slideOptions = {
  initialSlide: 0,
  slidesPerView: 1,
  autoplay: true
};



page:number =1;
status:any="";
filter:string="";
wordid: any="";
total:number=0;
last_page:number=0;
per_page:number=20;
order_id:any="id";
order_by:any="desc";
category:any="";


  modelData: any; 
  swiperdata: any;
  typedText = '';
  fullText = `Comprendre vos garanties n’a jamais été aussi facile.`;
  typingSpeed = 60; // ms par lettre


  cards = [
    {
      title: `L'IA qui rend vos contrats enfin comprehensibles.`,
      content: `Mutuelle, auto, habitation
      Notre intelligence artificielle lit, comprend et répond à  toutes vos questions instantanément`,
      image: 'assets/slide4.png',
      url: '/tabs/chat'
    },
    {
      title: 'Analysez vos devis',
      content: 'Déchiffrez, comprenez, décidez grace à votre IA. Clarty décrypte votre devis : montants, garanties, remboursements,... ',
      image: 'assets/slide2.png',
      url: '/tabs/devis' 
    },
    {
      title: 'Comparer vos contrats',
      content:  `Notre IA compare gratuitement vos contrats pour vous aider à faire des économies,
      améliorer vos garanties… le tout, sans prise de tête.`,
      image: 'assets/slide3.png',
      url: '/tabs/comparer'
    },
    {
      title: 'Comprendre son contrat grâce au Chat intelligent',
      content: 'Posez vos questions sur vos contrats, je suis la pour vous aider !',
      image: 'assets/slide1.png',
      url: '/tabs/files' 
    }
  ];

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },
    loop: true
  };

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
    public LoadingController: LoadingController,
    private localStore: LocalService,
    private translateConfigService: TranslateConfigService,
    private translate: TranslateService,
    public modalController: ModalController,
    private elRef: ElementRef ) {

  }


  
swiperSlideChanged(e: any) {
    console.log('changed: ', e);
  }

  async ngOnInit() {
    this.localStore.saveItem('lang',"fr");
    this.iduser = this.localStore.getItem('iduser');
    this.role = this.localStore.getItem('role');
    this.scrollToBottom(); 
    setTimeout(() => {
      this.openVideoPopup(); 
    }, 1500);

   
  }


  ionViewWillEnter() {
  
    this.startAutoplay();
  }

  ionViewDidEnter() {
    this.pageContent.scrollToTop(400); // 400ms d'animation
    this.typedText = '';
    this.typeWriter(0);

  
    this.startAutoplay();
    
  }
  onScroll(event: any) {
    const scrollTop = event.detail.scrollTop;
    this.isShrunk = scrollTop > 50;
  }

  ngAfterViewInit() {
    const elements = document.querySelectorAll('.smooth-button');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const target = entry.target as HTMLElement;
  
        if (entry.isIntersecting) {
          target.classList.add('animate-in');
          target.classList.remove('animate-out');
        } else {
          target.classList.remove('animate-in');
          target.classList.add('animate-out');
        }
      });
    }, {
      threshold: 0.3 // déclenche quand 30% de l'élément est visible
    });
  
    elements.forEach(el => observer.observe(el));




    const images = document.querySelectorAll('.smooth-img');

const observerImg = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
});

images.forEach(img => observerImg.observe(img));
  }

 
  typeWriter(index: number) {
    if (index < this.fullText.length) {
      this.typedText += this.fullText.charAt(index);
      setTimeout(() => this.typeWriter(index + 1), this.typingSpeed);
    }
  }
  startAutoplay() {
    if (this.swiperdata) {
      this.swiperdata.autoplay.start();
    }
  }
  isModalOpen = false;


// here you can check your parameter

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }


  async  goFiles() {
    this.router.navigateByUrl('/tabs/files');
  }
  
  async  gomodeemploi() {
    this.router.navigateByUrl('/modeemploi');
  }

  public changeLanguage() {
    this.translateConfigService.setLanguage(this.language);
  }






  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom(300);
    }, 100);
  }


  getLasTAssitant() {
    this.iduser = this.localStore.getItem('iduser');
  this.redditService.getDataBypageByUser(this.iduser,this.page,"assitantsByUser",this.per_page,this.order_id,this.order_by,this.category,this.status,this.filter).subscribe(data => {
    console.log(data);
    this.posts=data.data;
    this.posts[0].id

    this.router.navigateByUrl('/chat-doc/'+this.posts[0].id);
  })
}  


openVideoPopup() {
  this.showPopup = true;
}

closeVideoPopup() {
  this.showPopup = false;
}


}





